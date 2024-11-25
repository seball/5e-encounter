import { Injectable, signal } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { catchError, map, Observable, Subject, throwError, timer } from 'rxjs';
import { finalize, retry, takeUntil } from 'rxjs/operators';
import { STATBLOCK_REQUEST_MESSAGE } from '../config/statblock-message';
import { Statblock } from '../interfaces/statblock.interface';

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

@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  public isLoading = signal(false);
  private destroy$ = new Subject<void>();

  private readonly apiKey = 'AIzaSyDq0Zu7h3QYoikROWS85LWTR-zR0lF6iW4';
  private readonly apiUrl =
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent';

  private readonly retryConfig: RetryConfiguration = {
    maxRetries: 3,
    initialRetryDelay: 1000,
    maxRetryDelay: 5000,
    retryableStatuses: [503, 429, 500],
  };

  private readonly generationConfig = {
    response_mime_type: 'application/json',
    temperature: 0.7,
    top_k: 40,
    top_p: 0.95,
    max_output_tokens: 8192,
  } as const;

  constructor(private http: HttpClient) {}

  generateContent(description: string): Observable<Statblock> {
    this.destroy$.next();
    this.isLoading.set(true);
    return this.makeRequest(description).pipe(
      takeUntil(this.destroy$),
      retry({
        count: this.retryConfig.maxRetries,
        delay: (error, retryCount) => {
          if (!this.shouldRetry(error)) {
            return throwError(() => error);
          }

          const delay = this.calculateDelay(retryCount);
          console.log(
            `Retry attempt ${retryCount}/${this.retryConfig.maxRetries} after ${delay}ms`,
            `Status: ${error.status}`,
            `Error: ${error.message}`
          );

          return timer(delay);
        },
        resetOnSuccess: true,
      }),
      map(response => this.processResponse(response)),
      catchError(error => this.handleError(error)),
      finalize(() => {
        this.isLoading.set(false);
      })
    );
  }

  private makeRequest(description: string): Observable<GeminiResponse> {
    const url = `${this.apiUrl}?key=${this.apiKey}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const body = this.buildRequestBody(description);

    return this.http.post<GeminiResponse>(url, body, { headers });
  }

  private shouldRetry(error: unknown): boolean {
    return (
      error instanceof HttpErrorResponse &&
      this.retryConfig.retryableStatuses.includes(error.status)
    );
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
      const parsedResponse = JSON.parse(jsonText);
      return parsedResponse;
    } catch (error) {
      console.error('JSON parsing error:', error);
      throw new Error('Failed to parse Gemini response as JSON');
    }
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

  cancelRequest() {
    this.destroy$.next();
  }

  destroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
