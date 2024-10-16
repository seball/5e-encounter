import { OptionConfig } from '../shared/ui/editable-checkbox-list/editable-checkbox-list.component';

export const SAVING_THROWS_OPTIONS: OptionConfig = {
  'saving-throw-str': 'number',
  'saving-throw-dex': 'number',
  'saving-throw-con': 'number',
  'saving-throw-int': 'number',
  'saving-throw-wis': 'number',
  'saving-throw-cha': 'number',
};

export const SKILLS_OPTIONS: OptionConfig = {
  'skill-acrobatics': 'number',
  'skill-animal-handling': 'number',
  'skill-arcana': 'number',
  'skill-athletics': 'number',
  'skill-deception': 'number',
  'skill-history': 'number',
  'skill-insight': 'number',
  'skill-intimidation': 'number',
  'skill-investigation': 'number',
  'skill-medicine': 'number',
  'skill-nature': 'number',
  'skill-perception': 'number',
  'skill-performance': 'number',
  'skill-persuasion': 'number',
  'skill-religion': 'number',
  'skill-sleight-of-hand': 'number',
  'skill-stealth': 'number',
  'skill-survival': 'number',
};

export const SPEED_OPTIONS: OptionConfig = {
  cover: 'checkbox',
  fly: 'text',
  swim: 'text',
  burrow: 'text',
  climb: 'text',
  walk: 'text',
};

export const CONDITIONS_OPTIONS: OptionConfig = {
  poisoned: 'checkbox',
  exhaustion: 'checkbox',
  grappled: 'checkbox',
  paralyzed: 'checkbox',
  petrified: 'checkbox',
  prone: 'checkbox',
  restrained: 'checkbox',
  unconscious: 'checkbox',
  charmed: 'checkbox',
  frightened: 'checkbox',
  blinded: 'checkbox',
  deafened: 'checkbox',
  stunned: 'checkbox',
};

export const SENSES_OPTIONS: OptionConfig = {
  passive_perception: 'number',
  truesight: 'text',
  blindsight: 'text',
  darkvision: 'text',
  tremorsense: 'text',
};

export const DAMAGE_SOURCES_TAGS = [
  'acid',
  'bludgeoning',
  'cold',
  'fire',
  'force',
  'lightning',
  'necrotic',
  'piercing',
  'poison',
  'psychic',
  'radiant',
  'slashing',
  'thunder',
];

export const SIZES = ['Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan'];
export const MONSTER_TYPES = [
  'beast',
  'monstrosity',
  'dragon',
  'humanoid',
  'undead',
  'fiend',
  'celestial',
  'construct',
  'giant',
  'elemental',
  'fey',
  'aberration',
  'ooze',
  'swarm',
  'plant',
];
export const ALIGNMENTS = [
  'lawful evil',
  'any alignment',
  'chaotic evil',
  'chaotic good',
  'lawful good',
  'neutral',
  'lawful neutral',
  'unaligned',
  'any non-good alignment',
  'any non-lawful alignment',
  'neutral evil',
  'any chaotic alignment',
  'neutral good',
  'chaotic neutral',
  'neutral good (50%) or neutral evil (50%)',
  'any evil alignment',
];
