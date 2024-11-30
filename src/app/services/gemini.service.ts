import { computed, effect, Injectable, signal } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { catchError, map, Observable, Subject, throwError, timer } from 'rxjs';
import { finalize, retry, takeUntil } from 'rxjs/operators';
import { STATBLOCK_REQUEST_MESSAGE } from '../config/statblock-message';
import { Statblock } from '../interfaces/statblock.interface';
import { ApiStorageService } from './storage/api-storage.service';

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

interface RetryConfiguration {
  maxRetries: number;
  initialRetryDelay: number;
  maxRetryDelay: number;
  retryableStatuses: number[];
}

export interface Model {
  displayName: string;
  supportedGenerationMethods: string[];
  name: string;
  description: string;
  outputTokenLimit: number;
}

interface ModelsState {
  data: Model[];
  loading: boolean;
  error?: string;
}

@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  private modelsState = signal<ModelsState>({
    data: [],
    loading: false,
  });

  public models = computed(() => this.modelsState().data);
  public isLoadingModels = computed(() => this.modelsState().loading);
  public modelsError = computed(() => this.modelsState().error);
  public isLoading = signal(false);
  private destroy$ = new Subject<void>();
  private selectedModel = signal<string>('models/gemini-1.5-pro-latest');

  private readonly baseUrl =
    'https://generativelanguage.googleapis.com/v1beta/models';
  private readonly apiKey = computed(() => this.apiStorage.getApiKey());

  private readonly retryConfig: RetryConfiguration = {
    maxRetries: 3,
    initialRetryDelay: 1000,
    maxRetryDelay: 5000,
    retryableStatuses: [503, 429, 500],
  };

  private readonly generationConfig = {
    response_mime_type: 'application/json',
    max_output_tokens: 8192,
  } as const;

  constructor(
    private http: HttpClient,
    private readonly apiStorage: ApiStorageService
  ) {
    this.initializeModelState();
  }
  setModel(modelName: string): void {
    console.log(`Selected model: ${modelName}`);
    if (this.models().some(model => model.name === modelName)) {
      this.selectedModel.set(modelName);
    } else {
      console.warn(`Invalid model name: ${modelName}`);
    }
  }

  generateContent(description: string): Observable<Statblock> {
    this.destroy$.next();
    this.isLoading.set(true);

    return this.makeRequest(description).pipe(
      takeUntil(this.destroy$),
      retry({
        count: this.retryConfig.maxRetries,
        delay: this.handleRetryDelay.bind(this),
        resetOnSuccess: true,
      }),
      map(response => this.processResponse(response)),
      catchError(error => this.handleError(error)),
      finalize(() => this.isLoading.set(false))
    );
  }

  cancelRequest(): void {
    this.destroy$.next();
  }

  destroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeModelState(): void {
    effect(
      () => {
        const apiKey = this.apiStorage.getApiKey();
        if (apiKey) {
          this.loadModels();
        } else {
          this.modelsState.update(state => ({
            ...state,
            data: [],
            error: undefined,
          }));
        }
      },
      { allowSignalWrites: true }
    );
  }

  private loadModels(): void {
    this.modelsState.update(state => ({ ...state, loading: true }));

    this.fetchAvailableModels()
      .pipe(
        finalize(() => {
          this.modelsState.update(state => ({ ...state, loading: false }));
        })
      )
      .subscribe({
        next: models => {
          this.modelsState.update(state => ({
            ...state,
            data: models,
            error: undefined,
          }));
        },
        error: error => {
          this.modelsState.update(state => ({
            ...state,
            error: this.buildErrorMessage(error),
          }));
        },
      });
  }

  private fetchAvailableModels(): Observable<Model[]> {
    const url = `${this.baseUrl}?key=${this.apiKey()}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.get<{ models: Model[] }>(url, { headers }).pipe(
      map(response =>
        response.models.filter(
          model =>
            model.supportedGenerationMethods.includes('generateContent') &&
            model.outputTokenLimit >= 8192
        )
      ),
      catchError(error => this.handleError(error))
    );
  }

  private makeRequest(description: string): Observable<GeminiResponse> {
    const url = `https://generativelanguage.googleapis.com/v1beta/${this.selectedModel()}:generateContent?key=${this.apiKey()}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const body = this.buildRequestBody(description);

    return this.http.post<GeminiResponse>(url, body, { headers });
  }

  private buildRequestBody(description: string) {
    const text = STATBLOCK_REQUEST_MESSAGE(description);
    return {
      contents: [
        {
          parts: [{ text }],
        },
      ],
      generation_config: this.generationConfig,
    };
  }

  private processResponse(response: GeminiResponse): Statblock {
    if (!response?.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid response format from Gemini API');
    }

    const jsonText = response.candidates[0].content.parts[0].text;
    try {
      return JSON.parse(jsonText);
    } catch (error) {
      console.error('JSON parsing error:', error);
      throw new Error('Failed to parse Gemini response as JSON');
    }
  }

  private handleRetryDelay(
    error: unknown,
    retryCount: number
  ): Observable<number> {
    if (!this.shouldRetry(error)) {
      return throwError(() => error);
    }

    const delay = this.calculateDelay(retryCount);
    if (error instanceof HttpErrorResponse) {
      console.log(
        `Retry attempt ${retryCount}/${this.retryConfig.maxRetries} after ${delay}ms`,
        `Status: ${error.status}`,
        `Error: ${error.message}`
      );
    }

    return timer(delay);
  }

  private shouldRetry(error: unknown): boolean {
    return (
      error instanceof HttpErrorResponse &&
      this.retryConfig.retryableStatuses.includes(error.status)
    );
  }

  private calculateDelay(retryCount: number): number {
    return Math.min(
      this.retryConfig.initialRetryDelay * Math.pow(2, retryCount - 1),
      this.retryConfig.maxRetryDelay
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    const errorMessage = this.buildErrorMessage(error);
    console.error('API Error:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }

  private buildErrorMessage(error: HttpErrorResponse): string {
    if (error.error instanceof ErrorEvent) {
      return `Client error: ${error.error.message}`;
    }

    const statusMessages: Record<number, string> = {
      400: `Bad Request - ${error.error?.error?.message || 'Invalid request parameters'}`,
      401: 'Unauthorized - Invalid API key',
      403: 'Forbidden - Insufficient permissions',
      404: 'Not Found - The requested resource does not exist',
      429: 'Too Many Requests - Rate limit exceeded',
      500: 'Internal Server Error - Server failed to process request',
      503: 'Service Unavailable - The server is temporarily unavailable',
    };

    const defaultMessage = `Server error: ${error.status} - ${error.message}`;
    return `${statusMessages[error.status] || defaultMessage} (Request ID: ${Date.now()})`;
  }
}
