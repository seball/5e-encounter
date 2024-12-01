import { Injectable } from '@angular/core';
import { BaseStorageService } from './base-storage.service';
import { Character } from '../../interfaces/character.interface';

@Injectable({
  providedIn: 'root',
})
export class CharacterStorageService extends BaseStorageService {
  private readonly CHARACTER_KEY = 'characters';
  private readonly ACTIVE_CHARACTER_KEY = 'activeCharacterId';

  getAll(): Character[] {
    return this.get<Character[]>(this.CHARACTER_KEY) ?? [];
  }

  save(characters: Character[]): void {
    this.set(this.CHARACTER_KEY, characters);
  }

  getActiveCharacterId(): string | null {
    return this.get<string>(this.ACTIVE_CHARACTER_KEY);
  }

  setActiveCharacterId(id: string): void {
    this.set(this.ACTIVE_CHARACTER_KEY, id);
  }
}
