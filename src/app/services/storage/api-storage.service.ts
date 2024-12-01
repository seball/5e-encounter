import { Injectable } from '@angular/core';
import { BaseStorageService } from './base-storage.service';
import { signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiStorageService extends BaseStorageService {
  private readonly API_KEY = 'apiKey';
  private readonly apiKeySignal = signal<string>('');
  readonly apiKey = computed(() => this.apiKeySignal());

  constructor() {
    super();
    this.loadInitialApiKey();
  }

  private loadInitialApiKey(): void {
    const stored = this.get<string>(this.API_KEY);
    this.apiKeySignal.set(stored ?? '');
  }

  getApiKey(): string {
    return this.apiKeySignal();
  }

  saveApiKey(key: string): void {
    this.set(this.API_KEY, key);
    this.apiKeySignal.set(key);
  }

  clearApiKey(): void {
    this.remove(this.API_KEY);
    this.apiKeySignal.set('');
  }
}
