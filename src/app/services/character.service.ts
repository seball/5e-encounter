import { Injectable, signal } from '@angular/core';
import { Character } from '../interfaces/character.interface';
import { v4 as uuid } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  private charactersSignal = signal<Character[]>([]);

  constructor() {
    const savedCharacters = localStorage.getItem('characters');
    if (savedCharacters) {
      this.charactersSignal.set(JSON.parse(savedCharacters));
    }
  }

  get characters() {
    return this.charactersSignal.asReadonly();
  }

  public addCharacter(type: 'ally' | 'enemy'): void {
    const newCharacter: Character = {
      id: uuid(),
      name:
        type === 'ally'
          ? `Ally ${this.charactersSignal().length + 1}`
          : `Enemy ${this.charactersSignal().length + 1}`,
      type: type,
      maxHp: 100,
      currentHp: 100,
      initiativeModifier: 0,
      initiative: 0,
      avatarSrc: type === 'ally' ? `assets/elf.jpg` : `assets/barbarian.jpg`,
    };

    const updatedCharacters = [...this.charactersSignal(), newCharacter];
    this.charactersSignal.set(updatedCharacters);
    localStorage.setItem('characters', JSON.stringify(updatedCharacters));
  }

  public deleteCharacter(id: string): void {
    const updatedCharacters = this.charactersSignal().filter(c => c.id !== id);
    this.charactersSignal.set(updatedCharacters);

    localStorage.setItem('characters', JSON.stringify(updatedCharacters));
  }
}
