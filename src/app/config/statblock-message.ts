export const STATBLOCK_REQUEST_MESSAGE = (monsterDescription: string) => `
Generate a JSON object representing a D&D monster statblock. The JSON should adhere to the following requirements:

General Rules:
Use the provided Statblock TypeScript interface structure (detailed below).
The id should be a random generated UUID create one.
Set image and url to empty strings.
Populate fields with plausible values unless specified otherwise.
Use the description to fill relevant fields such as desc and infer other attributes as needed.
Be creative and imaginative, write very detailed statblock output.
Monster Description:

"${monsterDescription}"


Proficiencies:
Include at least one Saving Throw in the proficiencies array with:index starting with saving-throw-.
name prefixed with Saving Throw:.
availabe optios are (saving-throw-str, saving-throw-dex, saving-throw-con, saving-throw-int, saving-throw-wis, saving-throw-cha).
Include one  or more Skills in the proficiencies array with:index starting with skill-.
name prefixed with Skill:.
availabe options are (skill-acrobatics, skill-animal-handling, skill-arcana, skill-athletics, skill-deception, skill-history, skill-insight, skill-intimidation, skill-investigation, skill-medicine, skill-nature, skill-perception, skill-performance, skill-persuasion, skill-religion, skill-sleight-of-hand, skill-stealth, skill-survival).
Armor Class, Damage, and Conditions:
Add at least one ArmorClass entry with a valid type and value.
Include plausible entries in damage_vulnerabilities, damage_resistances, damage_immunities, and condition_immunities.
Include at least two senses (e.g., darkvision, blindsight).
Populate special_abilities, actions, and reactions with relevant details.
Use a default speed object with at least a walk value.
Aligments: get one from the list of aligments.
available options are (lawful evil, any alignment, chaotic evil, chaotic good, lawful good, neutral, lawful neutral, unaligned, any non-good alignment, any non-lawful alignment, neutral evil, any chaotic alignment, neutral good, chaotic neutral, neutral good (50%) or neutral evil (50%), any evil alignment)
Types: get one from the list of types.
available options are (beast, monstrosity, dragon, humanoid, undead, fiend, celestial, construct, giant, elemental, fey, aberration, ooze, swarm, plant)
Sizes: get one from the list of sizes.
available options are (Tiny, Small, Medium, Large, Huge, Gargantuan)
Contitions: get any number of contuions from the list of conditions.
available options are (poisoned, exhaustion, grappled, paralyzed, petrified, prone, restrained, unconscious, charmed, frightened, blinded, deafened, stunned) don't use contition prefix here.
Actions: at least one action is required.
If action is attack, add to hit modifier and hit dmg, optionaly add reach.

Statblock Interfaces for Reference:
type URL = string;
type DiceRoll = string;
interface APIReference {
index: string;
name: string;
url: URL;
}
export interface NameDescription {
name: string;
desc: string;
}
export interface Speed {
walk?: string;
burrow?: string;
climb?: string;
fly?: string;
swim?: string;
hover?: boolean;
}
export interface Senses {
passive_perception: number;
blindsight?: string;
darkvision?: string;
tremorsense?: string;
truesight?: string;
}
export type Proficiency = APIReference;
export type ConditionImmunities = APIReference;
export interface MonsterProficiency {
proficiency: Proficiency;
value: number;
}
interface ArmorClass {
type: string;
value: number;
}
interface Damage {
damage_type: APIReference;
damage_dice: DiceRoll;
}
export interface Usage {
type?: 'per day' | 'recharge on roll' | 'recharge after rest';
dice?: DiceRoll;
min_value?: number;
times?: number;
rest_types?: string[];
}
export interface Action extends NameDescription {
attack_bonus?: number;
damage?: Damage[];
usage?: Usage;
}
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
reactions: Action[];
image: URL;
url: URL;
hasCustomImage: boolean;
}
The generated output must be valid JSON and formatted clearly for readability.`;
