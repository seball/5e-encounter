import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Monster } from '../interfaces/monster.interface';

@Injectable({
    providedIn: 'root'
  })
  export class Dnd5eApiService {
    private apiUrl = 'https://www.dnd5eapi.co/api/monsters';
  
    constructor(private http: HttpClient) { }
  
    getMonster(index: string): Observable<Monster> {
      return this.http.get<Monster>(`${this.apiUrl}/${index}`);
    }
  
  }