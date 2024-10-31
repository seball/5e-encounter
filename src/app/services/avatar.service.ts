import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AvatarService {
  constructor(private http: HttpClient) {}

  getAvatarList(): Observable<string[]> {
    return this.http
      .get<{ avatars: string[] }>('assets/portraits/avatars.json')
      .pipe(map(response => response.avatars));
  }
}
