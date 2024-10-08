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

export const DAMAGE_SOURCES_TAGS = [
  { name: 'acid', color: '#7FBC8C' },
  { name: 'bludgeoning', color: '#8C8C8C' },
  { name: 'cold', color: '#7FB3BC' },
  { name: 'fire', color: '#BC7F7F' },
  { name: 'force', color: '#B57FBC' },
  { name: 'lightning', color: '#BCB77F' },
  { name: 'necrotic', color: '#6B5B95' },
  { name: 'piercing', color: '#BC9F7F' },
  { name: 'poison', color: '#7FBC9F' },
  { name: 'psychic', color: '#BC7FB3' },
  { name: 'radiant', color: '#BCBC7F' },
  { name: 'slashing', color: '#9F7FBC' },
  { name: 'thunder', color: '#7F95BC' },
];
