import { Character } from './character.interface';

export interface Battlefield {
  id: string;
  name: string;
  timestamp: string;
  characters: Character[];
}
