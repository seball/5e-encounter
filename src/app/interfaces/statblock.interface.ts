export interface Statblock {
  id: string;
  index: string;
  name: string;
  size: string;
  type: string;
  alignment: string;
  armor_class: {
    type: string;
    value: number;
  }[];
  hit_points: number;
  hit_dice: string;
  hit_points_roll: string;
  speed: Speed;
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  proficiencies: MonsterProficieny[];
  damage_vulnerabilities: string[];
  damage_resistances: string[];
  damage_immunities: string[];
  condition_immunities: {
    index: string;
    name: string;
    url: string;
  }[];
  senses: Senses;
  languages: string;
  challenge_rating: number;
  proficiency_bonus: number;
  xp: number;
  special_abilities: {
    name: string;
    desc: string;
  }[];
  actions: {
    name: string;
    multiattack_type?: string;
    desc: string;
    attack_bonus?: number;
    damage?: {
      damage_type: {
        index: string;
        name: string;
        url: string;
      };
      damage_dice: string;
    }[];
    actions?: any[];
  }[];
  image: string;
  url: string;
  legendary_actions: any[];
}

export interface Speed {
  burrow?: string;
  climb?: string;
  fly?: string;
  hover?: boolean;
  swim?: string;
  walk?: string;
}

export interface Senses {
  blindsight?: string;
  darkvision?: string;
  passive_perception: number;
  tremorsense?: string;
  truesight?: string;
}

export interface MonsterProficieny {
  proficiency: Proficiency;
  value: number;
}

export interface Proficiency {
  index: string;
  name: string;
  url: string;
}
