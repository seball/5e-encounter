import { computed, Injectable, signal } from '@angular/core';
import { STATBLOCK_TEMPLATE } from '../config/statblock-template';
import { Character } from '../interfaces/character.interface';
import { Statblock } from '../interfaces/statblock.interface';
import { v4 as uuid } from 'uuid';

interface ImportData {
  characters: unknown[];
  version: string;
  exportDate: string;
}

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  private charactersSignal = signal<Character[]>([]);
  private activeCharacterIdSignal = signal<string | null>(null);
  private editingCharacterIdSignal = signal<string | null>(null);
  private editingCharacterOriginalStateSignal = signal<Character | null>(null);
  private initiativeChangedSignal = signal<boolean>(false);

  constructor() {
    this.loadFromStorage();
  }

  get characters() {
    return this.charactersSignal.asReadonly();
  }

  get activeCharacterId() {
    return this.activeCharacterIdSignal.asReadonly();
  }

  get initiativeChanged() {
    return this.initiativeChangedSignal.asReadonly();
  }
  get editingCharacterId() {
    return this.editingCharacterIdSignal.asReadonly();
  }

  public getAllies = computed(() =>
    this.characters()
      .filter(c => c.type === 'ally')
      .sort((a, b) => (a.id > b.id ? 1 : -1))
  );

  public getEnemies = computed(() =>
    this.characters()
      .filter(c => c.type === 'enemy')
      .sort((a, b) => (a.id > b.id ? 1 : -1))
  );

  public switchSides(id: string): void {
    const character = this.charactersSignal().find(c => c.id === id);
    if (!character) return;
    const updatedCharacter: Character = {
      ...character,
      type: character.type === 'ally' ? 'enemy' : 'ally',
    };
    this.updateCharacter(updatedCharacter);
  }

  public duplicateCharacter(id: string): void {
    const originalCharacter = this.charactersSignal().find(c => c.id === id);
    if (!originalCharacter) return;
    const originalTimestamp = parseInt(originalCharacter.id.split('-')[0]);

    const duplicatedCharacter: Character = {
      ...structuredClone(originalCharacter),
      id: `${originalTimestamp + 1}${uuid()}`,
      name: `${originalCharacter.name}`,
      initiativeRoll: null,
      initiativeScore: null,
      hasRolledInitiative: false,
    };

    if (duplicatedCharacter.statblock) {
      duplicatedCharacter.statblock = {
        ...duplicatedCharacter.statblock,
        id: uuid(),
      };
    }

    this.addCharacter(duplicatedCharacter);
  }

  public startEditingCharacter(id: string): void {
    const character = this.charactersSignal().find(c => c.id === id);
    if (character) {
      this.editingCharacterOriginalStateSignal.set(structuredClone(character));
      this.editingCharacterIdSignal.set(id);
    }
  }

  public startEditingLastCreatedCharacter(): void {
    const character = this.charactersSignal().at(-1);
    if (character) {
      this.editingCharacterOriginalStateSignal.set(structuredClone(character));
      this.editingCharacterIdSignal.set(character.id);
    }
  }

  public stopEditingCharacter(): void {
    this.editingCharacterIdSignal.set(null);
    this.editingCharacterOriginalStateSignal.set(null);
  }

  public revertEditingChanges(): void {
    const originalState = this.editingCharacterOriginalStateSignal();
    const editingId = this.editingCharacterIdSignal();
    if (originalState && editingId) {
      this.updateCharacter(structuredClone(originalState));
    }
  }

  public activateCharacter(id: string): void {
    if (this.charactersSignal().some(c => c.id === id)) {
      this.activeCharacterIdSignal.set(id);
      this.saveActiveCharacterId();
    }
  }

  public activateLastCreatedCharacter(): void {
    const character = this.charactersSignal().at(-1);
    if (character) {
      this.activeCharacterIdSignal.set(character.id);
      this.saveActiveCharacterId();
    }
  }

  public deactivateCharacter(): void {
    this.activeCharacterIdSignal.set(null);
    this.saveActiveCharacterId();
  }

  public addDefaultCharacter(type: 'ally' | 'enemy'): void {
    const newCharacter: Character = {
      id: Date.now() + uuid(),
      name: `${type === 'ally' ? 'Ally' : 'Enemy'} ${this.characters().length + 1}`,
      type: type,
      maxHp: 10,
      currentHp: 10,
      initiativeModifier: 0,
      initiativeRoll: null,
      avatarSrc: '',
      armorClass: 15,
      initiativeScore: null,
      hasRolledInitiative: false,
    };
    this.addCharacter(newCharacter);
  }

  public updateCharacter(updatedCharacter: Character): void {
    const updatedCharacters = this.charactersSignal().map(character =>
      character.id === updatedCharacter.id ? updatedCharacter : character
    );
    this.updateCharacters(updatedCharacters);
  }

  public updateActiveCharacter(): void {
    const activeId = this.activeCharacterIdSignal();
    if (!activeId) return;
    const character = this.charactersSignal().find(c => c.id === activeId);
    if (!character) return;
    this.updateCharacter(character);
  }

  public updateCharacterImage(
    updatedCharacter: Character,
    avatarSrc: string
  ): void {
    updatedCharacter.avatarSrc = avatarSrc;
    this.updateCharacter(updatedCharacter);
  }

  public deleteCharacter(id: string): void {
    const updatedCharacters = this.charactersSignal().filter(c => c.id !== id);
    this.updateCharacters(updatedCharacters);
    if (this.activeCharacterIdSignal() === id) {
      this.deactivateCharacter();
    }
    if (this.editingCharacterIdSignal() === id) {
      this.stopEditingCharacter();
    }
  }

  public notifyInitiativeChanged(): void {
    this.initiativeChangedSignal.update(value => !value);
  }

  public getActiveCharacterStatblock(): Statblock | undefined {
    const activeId = this.activeCharacterIdSignal();
    if (!activeId) return undefined;

    const activeCharacter = this.charactersSignal().find(
      c => c.id === activeId
    );
    return activeCharacter?.statblock;
  }

  public updateCharacterByStatblockId(statblockId: string): void {
    const updatedCharacter = this.charactersSignal().find(
      c => c.statblock?.id === statblockId
    );
    if (!updatedCharacter) return;

    this.updateCharacter(updatedCharacter);
  }

  public createDefaultStatblock(): void {
    const activeId = this.activeCharacterIdSignal();
    if (!activeId) return;

    const activeCharacter = this.charactersSignal().find(
      c => c.id === activeId
    );
    if (activeCharacter) {
      activeCharacter.statblock = {
        id: uuid(),
        index: 'custom',
        name: activeCharacter.name,
        ...STATBLOCK_TEMPLATE,
      };
      this.updateCharacter(activeCharacter);
    }
  }

  private updateCharacters(characters: Character[]): void {
    this.charactersSignal.set(characters);
    this.saveCharacters();
  }

  public addCharacter(newCharacter: Character): void {
    this.updateCharacters([...this.charactersSignal(), newCharacter]);
  }

  private loadFromStorage(): void {
    const savedCharacters = localStorage.getItem('characters');
    if (savedCharacters) {
      this.charactersSignal.set(JSON.parse(savedCharacters));
    }

    const savedActiveCharacterId = localStorage.getItem('activeCharacterId');
    if (savedActiveCharacterId) {
      this.activeCharacterIdSignal.set(savedActiveCharacterId);
    }
  }

  private saveCharacters(): void {
    localStorage.setItem('characters', JSON.stringify(this.charactersSignal()));
  }

  private saveActiveCharacterId(): void {
    localStorage.setItem(
      'activeCharacterId',
      this.activeCharacterIdSignal() || ''
    );
  }

  private getInitiativeMod(dexterity: number): number {
    return Math.floor((dexterity - 10) / 2);
  }

  public createCharacterFromStatblock(
    statblock: Statblock,
    characterType: 'ally' | 'enemy'
  ): Character {
    const imageName = statblock.index || 'default';
    statblock.id = uuid();
    return {
      avatarSrc: `assets/${imageName}.webp`,
      currentHp: statblock.hit_points,
      maxHp: statblock.hit_points,
      id: Date.now() + uuid(),
      type: characterType,
      initiativeRoll: null,
      initiativeModifier: this.getInitiativeMod(statblock.dexterity) || 0,
      name: statblock.name,
      armorClass: statblock.armor_class[0].value,
      statblock: statblock,
      initiativeScore: null,
      hasRolledInitiative: false,
    };
  }

  public exportCharacters(filename: string = 'characters-export.json'): void {
    const charactersToExport = this.charactersSignal();
    const exportData: ImportData = {
      characters: charactersToExport,
      version: '1.0',
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  public async importCharacters(file: File): Promise<void> {
    try {
      const fileContent = await file.text();
      const importData = JSON.parse(fileContent) as ImportData;

      if (!importData.characters || !Array.isArray(importData.characters)) {
        throw new Error('Invalid import file format');
      }

      const validatedCharacters: unknown[] = importData.characters.map(
        (char: unknown) => {
          if (!this.isValidCharacter(char)) {
            const name = this.extractName(char);
            throw new Error(`Invalid character data: ${name || 'unnamed'}`);
          }

          // Generate new IDs to avoid conflicts
          const newId = Date.now() + uuid();
          const newStatblockId = char.statblock ? uuid() : undefined;

          return {
            ...char,
            id: newId,
            statblock: char.statblock
              ? { ...char.statblock, id: newStatblockId }
              : undefined,
            initiativeRoll: null,
            initiativeScore: null,
            hasRolledInitiative: false,
          };
        }
      );

      const updatedCharacters = [
        ...this.charactersSignal(),
        ...validatedCharacters,
      ];
      this.updateCharacters(updatedCharacters as Character[]);
    } catch (error) {
      console.error('Error importing characters:', error);
      throw error;
    }
  }

  private extractName(char: unknown): string {
    if (typeof char === 'object' && char !== null && 'name' in char) {
      return String((char as { name: unknown }).name);
    }
    return '';
  }

  private isValidCharacter(char: unknown): char is Character {
    if (typeof char !== 'object' || char === null) {
      return false;
    }

    const characterCheck = char as Partial<Character>;

    return (
      typeof characterCheck.name === 'string' &&
      typeof characterCheck.type === 'string' &&
      (characterCheck.type === 'ally' || characterCheck.type === 'enemy') &&
      typeof characterCheck.maxHp === 'number' &&
      typeof characterCheck.currentHp === 'number' &&
      typeof characterCheck.initiativeModifier === 'number' &&
      typeof characterCheck.armorClass === 'number' &&
      (characterCheck.statblock === undefined ||
        (typeof characterCheck.statblock === 'object' &&
          characterCheck.statblock !== null))
    );
  }
}
