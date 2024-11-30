import { Injectable, computed, Signal } from '@angular/core';
import { Battlefield } from '../interfaces/battlefield.interface';
import { Statblock } from '../interfaces/statblock.interface';
import { BattlefieldStorageService } from '../services/storage/battlefield-storage.service';
import { StatblockStorageService } from '../services/storage/statblock-storage.service';
import { CharacterStorageService } from '../services/storage/character-storage.service';
import { ViewStorageService } from '../services/storage/view-storage.service';
import { Character } from '../interfaces/character.interface';
import { ViewType } from '../services/viewManager.service';
import { ApiStorageService } from '../services/storage/api-storage.service';

@Injectable({
  providedIn: 'root',
})
export class StorageFacade {
  readonly battlefields: Signal<Battlefield[]> = computed(() =>
    this.battlefieldStorage.battlefields()
  );

  readonly statblocks: Signal<Statblock[]> = computed(() =>
    this.statblockStorage.statblocks()
  );

  constructor(
    private readonly battlefieldStorage: BattlefieldStorageService,
    private readonly statblockStorage: StatblockStorageService,
    private readonly characterStorage: CharacterStorageService,
    private readonly viewStorage: ViewStorageService,
    private readonly apiStorage: ApiStorageService
  ) {}

  // Battlefield methods
  getBattlefields(): Battlefield[] {
    return this.battlefieldStorage.getAll();
  }

  getBattlefieldById(id: string): Battlefield | undefined {
    return this.battlefieldStorage.getById(id);
  }

  saveBattlefield(name: string, characters?: Character[]): Battlefield {
    const charactersToSave = characters ?? this.characterStorage.getAll();
    return this.battlefieldStorage.save(name, charactersToSave);
  }

  updateBattlefield(battlefield: Battlefield): void {
    this.battlefieldStorage.update(battlefield);
  }

  deleteBattlefield(id: string): void {
    this.battlefieldStorage.delete(id);
  }

  loadBattlefield(id: string): void {
    const battlefield = this.battlefieldStorage.getById(id);
    if (!battlefield) {
      throw new Error(`Battlefield with id ${id} not found`);
    }
    this.characterStorage.save(battlefield.characters);
  }

  getCharacters(): Character[] {
    return this.characterStorage.getAll();
  }

  setCharacters(characters: Character[]): void {
    this.characterStorage.save(characters);
  }

  getActiveCharacterId(): string | null {
    return this.characterStorage.getActiveCharacterId();
  }

  setActiveCharacterId(id: string): void {
    this.characterStorage.setActiveCharacterId(id);
  }

  getStatblocks(): Statblock[] {
    return this.statblockStorage.getAll();
  }

  addStatblock(statblock: Statblock): void {
    this.statblockStorage.save(statblock);
  }

  getApiKey(): string {
    return this.apiStorage.getApiKey();
  }

  saveApiKey(key: string): void {
    this.apiStorage.saveApiKey(key);
  }

  deleteStatblock(id: string): void {
    this.statblockStorage.delete(id);
  }

  getView(): ViewType {
    return this.viewStorage.getView();
  }

  setView(view: ViewType): void {
    this.viewStorage.setView(view);
  }

  exportData(): {
    battlefields: Battlefield[];
    characters: Character[];
    statblocks: Statblock[];
    view: ViewType;
  } {
    return {
      battlefields: this.getBattlefields(),
      characters: this.getCharacters(),
      statblocks: this.getStatblocks(),
      view: this.getView(),
    };
  }

  validateStorageState(): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    try {
      this.getBattlefields();
    } catch {
      errors.push('Invalid battlefield data in storage');
    }

    try {
      this.getCharacters();
    } catch {
      errors.push('Invalid character data in storage');
    }

    try {
      this.getStatblocks();
    } catch {
      errors.push('Invalid statblock data in storage');
    }

    try {
      this.getView();
    } catch {
      errors.push('Invalid view state in storage');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
