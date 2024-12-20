import { Statblock } from '../interfaces/statblock.interface';

export const STATBLOCK_TEMPLATE: Omit<Statblock, 'id' | 'index' | 'name'> = {
  proficiency_bonus: 2,
  size: 'Medium',
  type: 'humanoid',
  alignment: 'any alignment',
  armor_class: [
    {
      type: 'dex',
      value: 10,
    },
  ],
  hit_points: 10,
  hit_dice: '2d8',
  hit_points_roll: '10',
  speed: {
    walk: '30 ft.',
  },
  strength: 10,
  dexterity: 10,
  constitution: 10,
  intelligence: 10,
  wisdom: 10,
  charisma: 10,
  xp: 10,
  challenge_rating: 0,
  special_abilities: [],
  damage_vulnerabilities: [],
  damage_resistances: [],
  damage_immunities: [],
  condition_immunities: [],
  proficiencies: [],
  languages: 'any one language (usually Common)',
  senses: {
    passive_perception: 12,
  },
  actions: [
    {
      name: 'Club',
      desc: 'Melee Weapon Attack: +2 to hit, reach 5 ft., one target. Hit: 2 (1d4) bludgeoning damage.',
      attack_bonus: 2,
      damage: [
        {
          damage_type: {
            index: 'bludgeoning',
            name: 'Bludgeoning',
            url: '/api/damage-types/bludgeoning',
          },
          damage_dice: '1d4',
        },
      ],
    },
  ],
  reactions: [],
  legendary_actions: [],
  lair_actions: [],
  hasCustomImage: false,
  image: '',
  url: '',
};
