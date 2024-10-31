import { computed, Injectable, signal } from '@angular/core';
import { STATBLOCK_TEMPLATE } from '../config/statblock-template';
import { Character } from '../interfaces/character.interface';
import { Statblock } from '../interfaces/statblock.interface';
import { v4 as uuid } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  private charactersSignal = signal<Character[]>([]);
  private activeCharacterIdSignal = signal<string | null>(null);
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

  public activateCharacter(id: string): void {
    if (this.charactersSignal().some(c => c.id === id)) {
      this.activeCharacterIdSignal.set(id);
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
}
