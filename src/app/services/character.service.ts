import { Injectable, signal } from '@angular/core';
import { Character } from '../interfaces/character.interface';
import { v4 as uuid } from 'uuid';
import { Dnd5eApiService } from './dnd5eapi.service';
import { Monster } from '../interfaces/monster.interface';

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  private charactersSignal = signal<Character[]>([]);

  constructor(private readonly dnd5eApiService: Dnd5eApiService) {
    this.loadCharacters();
  }

  get characters() {
    return this.charactersSignal.asReadonly();
  }

  public addPredefinedCharacter(
    characterType: 'ally' | 'enemy',
    monsterIndex: string
  ): void {
    this.dnd5eApiService.getMonster(monsterIndex).subscribe({
      next: monsterData => {
        const newCharacter = this.createCharacterFromMonsterData(
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

  private createCharacterFromMonsterData(
    monsterData: Monster,
    characterType: 'ally' | 'enemy'
  ): Character {
    const imageName = monsterData.index || 'default';
    return {
      avatarSrc: `assets/${imageName}.jpg`,
      currentHp: monsterData.hit_points,
      maxHp: monsterData.hit_points,
      id: uuid(),
      type: characterType,
      initiative: 0,
      initiativeModifier: this.getInitiativeMod(monsterData.dexterity) || 0,
      name: monsterData.name,
      armorClass: monsterData.armor_class[0].value,
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
      initiative: 0,
      avatarSrc: `assets/${type === 'ally' ? 'elf' : 'barbarian'}.jpg`,
      armorClass: 15,
    };
    this.updateCharacters([...this.charactersSignal(), newCharacter]);
  }

  public deleteCharacter(id: string): void {
    const updatedCharacters = this.charactersSignal().filter(c => c.id !== id);
    this.updateCharacters(updatedCharacters);
  }

  public updateCharacter(updatedCharacter: Character): void {
    const updatedCharacters = this.charactersSignal().map(character =>
      character.id === updatedCharacter.id ? updatedCharacter : character
    );
    this.updateCharacters(updatedCharacters);
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
  public getInitiativeMod(dexterity: number): number {
    return Math.floor((dexterity - 10) / 2);
  }
}
