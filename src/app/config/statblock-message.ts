export const STATBLOCK_REQUEST_MESSAGE = (monsterDescription: string) => `
Create a unique and imaginative Dungeons & Dragons monster statblock in JSON format, adhering to the following guidelines:

**General Instructions:**
- **Structure:** Follow the provided Statblock TypeScript interface structure detailed below.
- **Unique Identifier:** Generate a random UUID for the 'id' field.
- **Media Fields:** Set 'image' and 'url' fields to empty strings.
- **Field Population:** Use plausible and creative values for all fields, unless specified otherwise.
- **Description Utilization:** Leverage the provided monster description to populate relevant fields such as 'desc' and infer other attributes as needed.
- **Creativity:** Ensure the statblock is detailed, original, and imaginative.

**Monster Description:**
"${monsterDescription}"

**Proficiencies:**
- Include at least one Saving Throw in the 'proficiencies' array with:
  - 'index' starting with 'saving-throw-'.
  - 'name' prefixed with 'Saving Throw:'.
  - Available options: 'saving-throw-str', 'saving-throw-dex', 'saving-throw-con', 'saving-throw-int', 'saving-throw-wis', 'saving-throw-cha'.
- Include one or more Skills in the 'proficiencies' array with:
  - 'index' starting with 'skill-'.
  - 'name' prefixed with 'Skill:'.
  - Available options: 'skill-acrobatics', 'skill-animal-handling', 'skill-arcana', 'skill-athletics', 'skill-deception', 'skill-history', 'skill-insight', 'skill-intimidation', 'skill-investigation', 'skill-medicine', 'skill-nature', 'skill-perception', 'skill-performance', 'skill-persuasion', 'skill-religion', 'skill-sleight-of-hand', 'skill-stealth', 'skill-survival'.

**Armor Class, Damage, and Conditions:**
- Add at least one 'ArmorClass' entry with a valid type and value.
- Include plausible entries in 'damage_vulnerabilities', 'damage_resistances', 'damage_immunities', and 'condition_immunities'.
- Include at least two senses (e.g., darkvision, blindsight).
- Populate 'special_abilities', 'actions', and 'reactions' with relevant details.
- Use a default 'speed' object with at least a 'walk' value.

**Alignments:**
- Select one from the following list: 'lawful evil', 'any alignment', 'chaotic evil', 'chaotic good', 'lawful good', 'neutral', 'lawful neutral', 'unaligned', 'any non-good alignment', 'any non-lawful alignment', 'neutral evil', 'any chaotic alignment', 'neutral good', 'chaotic neutral', 'neutral good (50%) or neutral evil (50%)', 'any evil alignment'.

**Types:**
- Choose one from the following list: 'beast', 'monstrosity', 'dragon', 'humanoid', 'undead', 'fiend', 'celestial', 'construct', 'giant', 'elemental', 'fey', 'aberration', 'ooze', 'swarm', 'plant'.

**Sizes:**
- Select one from the following list: 'Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan'.

**Conditions:**
- Include any number from the following list: 'poisoned', 'exhaustion', 'grappled', 'paralyzed', 'petrified', 'prone', 'restrained', 'unconscious', 'charmed', 'frightened', 'blinded', 'deafened', 'stunned'. Do not use the 'condition' prefix here.

**Actions:**
- At least one action is required.
- If the action is an attack, add 'to hit' modifier and hit damage; optionally add reach.
- For numeric fields, avoid using a '+' sign for positive numbers and always use a '-' sign for negative numbers.

**Statblock Interfaces for Reference:**

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
