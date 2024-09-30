export interface Character {
  id: string;
  name: string;
  type: 'ally' | 'enemy';
  maxHp: number;
  currentHp: number;
  initiativeModifier: number;
  initiative: number;
  avatarSrc: string;
}
