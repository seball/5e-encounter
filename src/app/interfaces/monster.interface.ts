
export interface Monster {
    index: string;
    name: string;
    size: string;
    type: string;
    alignment: string;
    armor_class: Array<{
      type: string;
      value: number;
    }>;
    hit_points: number;
    hit_dice: string;
    hit_points_roll: string;
    speed: {
      walk: string;
    };
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
    proficiencies: any[];
    damage_vulnerabilities: string[];
    damage_resistances: string[];
    damage_immunities: string[];
    condition_immunities: Array<{
      index: string;
      name: string;
      url: string;
    }>;
    senses: {
      blindsight: string;
      passive_perception: number;
    };
    languages: string;
    challenge_rating: number;
    proficiency_bonus: number;
    xp: number;
    special_abilities: Array<{
      name: string;
      desc: string;
    }>;
    actions: Array<{
      name: string;
      multiattack_type?: string;
      desc: string;
      attack_bonus?: number;
      damage?: Array<{
        damage_type: {
          index: string;
          name: string;
          url: string;
        };
        damage_dice: string;
      }>;
      actions?: any[];
    }>;
    image: string;
    url: string;
    legendary_actions: any[];
}