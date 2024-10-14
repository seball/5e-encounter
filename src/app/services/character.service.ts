import { Injectable, signal } from '@angular/core';
import { Character } from '../interfaces/character.interface';
import { v4 as uuid } from 'uuid';
import { Dnd5eApiService } from './dnd5eapi.service';
import { Statblock } from '../interfaces/statblock.interface';
import { MainViewService, ViewType } from './main-view.service';

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  private charactersSignal = signal<Character[]>([]);
  private activeCharacterIdSignal = signal<string | null>(null);

  constructor(
    private readonly dnd5eApiService: Dnd5eApiService,
    private readonly mainViewService: MainViewService
  ) {
    this.loadCharacters();
    this.loadActiveCharacterId();
  }

  get characters() {
    return this.charactersSignal.asReadonly();
  }

  get activeCharacterId() {
    return this.activeCharacterIdSignal.asReadonly();
  }

  public getAllies(): Character[] {
    return this.charactersSignal().filter(c => c.type === 'ally');
  }

  public getEnemies(): Character[] {
    return this.charactersSignal().filter(c => c.type === 'enemy');
  }

  public sortCharactersByInitiative(): void {
    const sortedCharacters = [...this.charactersSignal()].sort(
      (a, b) => b.initiative - a.initiative
    );
    this.updateCharacters(sortedCharacters);
  }

  public addPredefinedCharacter(
    characterType: 'ally' | 'enemy',
    monsterIndex: string
  ): void {
    this.dnd5eApiService.getMonster(monsterIndex).subscribe({
      next: monsterData => {
        const newCharacter = this.createCharacterFromStatblock(
          monsterData,
          characterType
        );
        this.updateCharacters([...this.charactersSignal(), newCharacter]);
      },
      error: error => {
        console.error(
          `Error fetching monster data for ${monsterIndex}:`,
          error
        );
      },
    });
  }

  private createCharacterFromStatblock(
    statblock: Statblock,
    characterType: 'ally' | 'enemy'
  ): Character {
    const imageName = statblock.index || 'default';
    statblock.id = uuid();
    return {
      avatarSrc: `assets/${imageName}.jpg`,
      currentHp: statblock.hit_points,
      maxHp: statblock.hit_points,
      id: uuid(),
      type: characterType,
      initiativeRoll: 1,
      initiativeModifier: this.getInitiativeMod(statblock.dexterity) || 0,
      name: statblock.name,
      armorClass: statblock.armor_class[0].value,
      statblock: statblock,
    };
  }

  public addDefaultCharacter(type: 'ally' | 'enemy'): void {
    const newCharacter: Character = {
      id: uuid(),
      name: `${type === 'ally' ? 'Ally' : 'Enemy'} ${
        this.charactersSignal().length + 1
      }`,
      type: type,
      maxHp: 100,
      currentHp: 100,
      initiativeModifier: 0,
      initiativeRoll: 0,
      avatarSrc: '',
      armorClass: 15,
    };
    this.updateCharacters([...this.charactersSignal(), newCharacter]);
  }

  public deleteCharacter(id: string): void {
    const updatedCharacters = this.charactersSignal().filter(c => c.id !== id);
    this.updateCharacters(updatedCharacters);
    if (this.activeCharacterIdSignal() === id) {
      this.deactivateCharacter();
    }
  }

  public updateCharacter(updatedCharacter: Character): void {
    const updatedCharacters = this.charactersSignal().map(character =>
      character.id === updatedCharacter.id ? updatedCharacter : character
    );
    console.log(updatedCharacter);
    this.updateCharacters(updatedCharacters);
  }

  public updateCharacterByStatblockId(statblockId: string): void {
    const updatedCharacter = this.charactersSignal().find(
      c => c.statblock?.id === statblockId
    );
    if (!updatedCharacter) {
      return;
    }
    this.updateCharacter(updatedCharacter);
  }

  public activateCharacter(id: string): void {
    if (this.charactersSignal().some(c => c.id === id)) {
      this.mainViewService.setCurrentView(ViewType.StatBlock);
      this.activeCharacterIdSignal.set(id);
      this.saveActiveCharacterId();
    }
  }

  public deactivateCharacter(): void {
    this.activeCharacterIdSignal.set(null);
    this.saveActiveCharacterId();
  }

  public getActiveCharacterStatblock(): Statblock | undefined {
    const activeId = this.activeCharacterIdSignal();
    if (!activeId) return undefined;

    const activeCharacter = this.charactersSignal().find(
      c => c.id === activeId
    );
    return activeCharacter?.statblock;
  }

  private updateCharacters(characters: Character[]): void {
    this.charactersSignal.set(characters);
    this.saveCharacters();
  }

  private loadCharacters(): void {
    const savedCharacters = localStorage.getItem('characters');
    if (savedCharacters) {
      this.charactersSignal.set(JSON.parse(savedCharacters));
    }
  }

  private saveCharacters(): void {
    localStorage.setItem('characters', JSON.stringify(this.charactersSignal()));
  }

  private loadActiveCharacterId(): void {
    const savedActiveCharacterId = localStorage.getItem('activeCharacterId');
    if (savedActiveCharacterId) {
      this.activeCharacterIdSignal.set(savedActiveCharacterId);
    }
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
}
