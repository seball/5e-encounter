import { computed, Injectable, signal } from '@angular/core';
import { Character } from '../interfaces/character.interface';
import { Statblock } from '../interfaces/statblock.interface';
import { ViewType } from './viewManager.service';
import { v4 as uuid } from 'uuid';

export enum StorageKey {
  CHARACTERS = 'characters',
  ACTIVE_CHARACTER_ID = 'activeCharacterId',
  STATBLOCKS = 'statblocks',
  VIEW = 'view',
}

interface StorageKeyType {
  [StorageKey.CHARACTERS]: Character[];
  [StorageKey.ACTIVE_CHARACTER_ID]: string;
  [StorageKey.STATBLOCKS]: Statblock[];
  [StorageKey.VIEW]: ViewType;
}

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly statblocksSignal = signal<Statblock[]>([]);
  readonly statblocks = computed(() => this.statblocksSignal());

  constructor() {
    this.loadInitialStatblocks();
  }

  private loadInitialStatblocks(): void {
    const stored = this.get(StorageKey.STATBLOCKS);
    this.statblocksSignal.set(stored ?? []);
  }
  get<T extends StorageKey>(key: T): StorageKeyType[T] | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading from storage [${key}]:`, error);
      return null;
    }
  }

  set<T extends StorageKey>(key: T, value: StorageKeyType[T]): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to storage [${key}]:`, error);
      throw new Error(`Failed to save data to storage: ${key}`);
    }
  }

  remove(key: StorageKey): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from storage [${key}]:`, error);
    }
  }

  getCharacters(): Character[] {
    return this.get(StorageKey.CHARACTERS) ?? [];
  }

  setCharacters(characters: Character[]): void {
    this.set(StorageKey.CHARACTERS, characters);
  }

  getActiveCharacterId(): string | null {
    return this.get(StorageKey.ACTIVE_CHARACTER_ID);
  }

  setActiveCharacterId(id: string): void {
    this.set(StorageKey.ACTIVE_CHARACTER_ID, id);
  }

  getStatblocks(): Statblock[] {
    return this.statblocksSignal();
  }

  setStatblocks(statblocks: Statblock[]): void {
    this.set(StorageKey.STATBLOCKS, statblocks);
    this.statblocksSignal.set(statblocks);
  }

  getView(): ViewType {
    return this.get(StorageKey.VIEW) ?? ViewType.Manual;
  }

  setView(view: ViewType): void {
    this.set(StorageKey.VIEW, view);
  }

  addStatblock(statblock: Statblock): void {
    const existingStatblocks = this.getStatblocks();
    const statblockCopy: Statblock = { ...statblock, id: uuid() };
    const updatedCollection = [...existingStatblocks, statblockCopy];
    this.setStatblocks(updatedCollection);
  }
}
