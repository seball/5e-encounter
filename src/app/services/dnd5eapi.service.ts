import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Monster, MonsterEntry } from '../interfaces/monster.interface';

@Injectable({
  providedIn: 'root',
})
export class Dnd5eApiService {
  private apiUrl = 'https://www.dnd5eapi.co/api/monsters';

  constructor(private http: HttpClient) {}

  getMonsterEntries(): Observable<MonsterEntry[]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.http.get<any>(this.apiUrl).pipe(map(rawResult => rawResult.results))
  }

  getMonster(index: string): Observable<Monster> {
    return this.http.get<Monster>(`${this.apiUrl}/${index}`);
  }
}
