import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Character } from '../interfaces/character.interface';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  private charactersSubject = new BehaviorSubject<Character[]>([]);
  characters$: Observable<Character[]> = this.charactersSubject.asObservable();

  addCharacter(type: 'ally' | 'enemy') {
    const newCharacter: Character = {
      name: type === 'ally' ? `Ally ${this.charactersSubject.value.length + 1}` : `Enemy ${this.charactersSubject.value.length + 1}`,
      type: type,
      maxHp: 100,
      currentHp: 100,
      initiativeModifier: 0,
      initiative: 0,
      avatarSrc: type === 'ally' ? `/assets/elf.jpg` : `/assets/barbarian.jpg`,
    };
    
    const currentCharacters = this.charactersSubject.value;
    this.charactersSubject.next([...currentCharacters, newCharacter]);
  }

  getCharacters(): Observable<Character[]> {
    return this.characters$;
  }
}