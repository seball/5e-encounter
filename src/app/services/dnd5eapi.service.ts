import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { Monster } from '../interfaces/monster.interface';

export interface ApiResult {
  index: string;
  name: string;
  url: string;
}

interface ApiResponse<T extends ApiResult> {
  count: number;
  results: T[];
}

@Injectable({
  providedIn: 'root',
})
export class Dnd5eApiService {
  private apiUrl = 'https://www.dnd5eapi.co/api';

  constructor(private http: HttpClient) {}

  getMonster(index: string): Observable<Monster> {
    return this.http
      .get<Monster>(`${this.apiUrl}/monsters/${index}`)
      .pipe(catchError(this.handleError));
  }

  getMonsterEntries(): Observable<ApiResult[]> {
    return this.http
      .get<ApiResponse<ApiResult>>(`${this.apiUrl}/monsters`)
      .pipe(
        catchError(this.handleError),
        map(response => response.results)
      );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error('API Error:', errorMessage);
    return of();
  }
}
