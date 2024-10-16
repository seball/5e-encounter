import { Statblock } from './statblock.interface';

export interface Character {
  armorClass: number;
  id: string;
  name: string;
  type: 'ally' | 'enemy';
  maxHp: number;
  currentHp: number;
  initiativeModifier: number;
  initiativeRoll: number | null;
  initiativeScore: number | null;
  avatarSrc: string;
  statblock?: Statblock;
  hasRolledInitiative: boolean;
}
