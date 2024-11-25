interface DiceFace {
  transform?: string;
  path: string;
  brightnessFactor?: number;
}

export interface DiceConfig {
  viewBox: string;
  faces: DiceFace[];
}

export const DICE_PATHS: Record<string, DiceConfig> = {
  d4: {
    viewBox: '0 0 176 161',
    faces: [
      {
        path: 'M88 0L176 161L0 161Z',
        brightnessFactor: 0.8,
      },
    ],
  },
  d6: {
    viewBox: '0 0 176 176',
    faces: [
      {
        path: 'M0 0L176 0L176 176L0 176Z',
        brightnessFactor: 0.8,
      },
    ],
  },
  d10: {
    viewBox: '0 0 200 206',
    faces: [
      {
        path: 'M2 134L38 135L101 166L164 135L200 134L101 206Z',
        brightnessFactor: 0.6,
      },
      {
        path: 'M101 1L164 135L200 134L198 82Z',
        brightnessFactor: 0.8,
      },
      {
        path: 'M38 135L101 1L2 82L2 134Z',
        brightnessFactor: 0.8,
      },
      {
        path: 'M101 1L38 135L101 166L164 135Z',
        brightnessFactor: 1.0,
      },
    ],
  },
  d8: {
    viewBox: '0 0 170 210',
    faces: [
      {
        path: 'M3 158L172 158L88 0Z',
        brightnessFactor: 1.0,
      },
      {
        path: 'M172 158L168 55L88 0Z',
        brightnessFactor: 0.8,
      },
      {
        path: 'M3 158L88 0L6 55Z',
        brightnessFactor: 0.8,
      },
      {
        path: 'M3 158L172 158L88 207Z',
        brightnessFactor: 0.5,
      },
    ],
  },
  d12: {
    viewBox: '0 0 185 195',
    faces: [
      {
        path: 'M55 145L127 145L148 75L90 33L33 77Z',
        brightnessFactor: 1.0,
      },
      {
        path: 'M127 145L148 175L93 193L36 177L55 145L127 145Z',
        brightnessFactor: 0.6,
      },
      {
        path: 'M148 75L183 65L182 125L148 175L127 145L148 75Z',
        brightnessFactor: 0.8,
      },
      {
        path: 'M55 145L36 177L2 127L0 67L33 77L55 145Z',
        brightnessFactor: 0.8,
      },
      {
        path: 'M148 75L183 65L147 18L91 0L35 20L0 67L33 77L90 33L148 75Z',
        brightnessFactor: 0.7,
      },
    ],
  },
  d20: {
    viewBox: '0 0 200 215',
    faces: [
      {
        path: 'M155 153 194 47l-96-1z',
        brightnessFactor: 1.0,
      },
      {
        path: 'm155 153 39-106-2 105z',
        brightnessFactor: 0.8,
      },
      {
        path: 'M155 153 98 217 41 153z',
        brightnessFactor: 0.8,
      },
      {
        path: 'm98 217 57-64 37-1z',
        brightnessFactor: 0.6,
      },
      {
        path: 'M41 153 2 151l96 66z',
        brightnessFactor: 0.6,
      },
      {
        path: 'M2 46h96L41 153z',
        brightnessFactor: 1.0,
      },
      {
        path: 'M41 153 2 151 2 46z',
        brightnessFactor: 0.8,
      },
      {
        path: 'M2 46 98 0l96 47-96-1z',
        brightnessFactor: 0.8,
      },
      {
        path: 'M41 153 98 46l57 107z',
        brightnessFactor: 1.2,
      },
    ],
  },
};
