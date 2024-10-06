// Basic reusable types
type URL = string;
type DiceRoll = string;

// Reusable interfaces
interface APIReference {
  index: string;
  name: string;
  url: URL;
}

interface NameDescription {
  name: string;
  desc: string;
}

// Speed interface
export interface Speed {
  walk?: string;
  burrow?: string;
  climb?: string;
  fly?: string;
  swim?: string;
  hover?: boolean;
}

// Senses interface
export interface Senses {
  passive_perception: number;
  blindsight?: string;
  darkvision?: string;
  tremorsense?: string;
  truesight?: string;
}

// Proficiency interfaces
export type Proficiency = APIReference;
export type ConditionImmunities = APIReference;

export interface MonsterProficiency {
  proficiency: Proficiency;
  value: number;
}

// Armor Class interface
interface ArmorClass {
  type: string;
  value: number;
}

// Damage interface
interface Damage {
  damage_type: APIReference;
  damage_dice: DiceRoll;
}

// Action interfaces
interface BaseAction extends NameDescription {
  attack_bonus?: number;
  damage?: Damage[];
}

interface MultiAttackAction extends BaseAction {
  multiattack_type: string;
  actions: BaseAction[];
}

type Action = BaseAction | MultiAttackAction;

export interface Statblock {
  id: string;
  index: string;
  name: string;
  size: string;
  type: string;
  alignment: string;
  armor_class: ArmorClass[];
  hit_points: number;
  hit_dice: DiceRoll;
  hit_points_roll: DiceRoll;
  speed: Speed;
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  proficiencies: MonsterProficiency[];
  damage_vulnerabilities: string[];
  damage_resistances: string[];
  damage_immunities: string[];
  condition_immunities: ConditionImmunities[];
  senses: Senses;
  languages: string;
  challenge_rating: number;
  proficiency_bonus: number;
  xp: number;
  special_abilities: NameDescription[];
  actions: Action[];
  legendary_actions: Action[];
  image: URL;
  url: URL;
}
