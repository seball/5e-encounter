import { Injectable, signal, computed } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { Statblock } from '../interfaces/statblock.interface';
import { StorageFacade } from '../facades/storage.facade';

export interface ApiResult {
  index: string;
  name: string;
  url: string;
  source?: 'api' | 'local';
  statblock?: Statblock;
}

interface ApiResponse<T extends ApiResult> {
  count: number;
  results: T[];
}

@Injectable({
  providedIn: 'root',
})
export class Dnd5eApiService {
  private readonly apiUrl = 'https://www.dnd5eapi.co/api';
  private readonly LOCAL_NAME_PREFIX = '--';
  private readonly LOCAL_NAME_SUFFIX = '--';

  private readonly apiMonstersSignal = signal<ApiResult[]>([]);
  private readonly localMonstersSignal = computed(() => {
    const statblocks = this.storageFacade.statblocks();
    return this.formatLocalMonsters(statblocks);
  });

  readonly monsterEntries = computed(() => [
    ...this.apiMonstersSignal(),
    ...this.localMonstersSignal(),
  ]);

  constructor(
    private http: HttpClient,
    private storageFacade: StorageFacade
  ) {
    this.loadApiMonsters();
  }

  private loadApiMonsters(): void {
    this.http
      .get<ApiResponse<ApiResult>>(`${this.apiUrl}/monsters`)
      .pipe(
        catchError(this.handleError),
        map(response => this.formatApiResults(response.results))
      )
      .subscribe(apiMonsters => {
        this.apiMonstersSignal.set(apiMonsters);
      });
  }

  private formatLocalMonsters(statblocks: Statblock[]): ApiResult[] {
    return statblocks.map(statblock => ({
      index: statblock.index,
      name: this.formatLocalMonsterName(statblock.name),
      url: '',
      source: 'local' as const,
      statblock: statblock,
    }));
  }

  getMonster(index: string): Observable<Statblock> {
    return this.http
      .get<Statblock>(`${this.apiUrl}/monsters/${index}`)
      .pipe(catchError(this.handleError));
  }

  private formatApiResults(results: ApiResult[]): ApiResult[] {
    return results.map(result => ({
      ...result,
      source: 'api' as const,
    }));
  }

  private formatLocalMonsterName(name: string): string {
    return `${this.LOCAL_NAME_PREFIX}${name}${this.LOCAL_NAME_SUFFIX}`;
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('API Error:', error);
    return of();
  }
}
