export interface Character {
  name: string;
  type: 'ally' | 'enemy';
  maxHp: number;
  currentHp: number;
  initiativeModifier: number;
  initiative: number;
  avatarSrc: string;
}
