import { Component, Input } from '@angular/core';
import { TaperedRuleComponent } from '../../../shared/ui/tapered-rule/tapered-rule.component';
import {
  MonsterProficieny,
  Senses,
} from '../../../interfaces/statblock.interface';
import { CommonModule } from '@angular/common';
import { NumberToStringPipe } from '../../../shared/pipes/number-to-string.pipe';

@Component({
  selector: 'app-properties',
  standalone: true,
  imports: [TaperedRuleComponent, CommonModule],
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.css'],
})
export class PropertiesComponent {
  @Input() proficiencies: MonsterProficieny[] = [];
  @Input() damageImmunities: string[] = [];
  @Input() conditionImmunities: { index: string; name: string; url: string }[] =
    [];
  @Input() senses: Senses = { passive_perception: 0 };
  @Input() languages: string = '';
  @Input() challengeRating: number = 0;
  @Input() xp: number = 0;

  private nts = new NumberToStringPipe();

  getDamageImmunitiesString(): string {
    return this.damageImmunities.join(', ');
  }

  getConditionImmunitesString(): string {
    return this.conditionImmunities.map(c => c.name).join(', ');
  }

  getSensesString(): string {
    console.log(this.senses);
    const sensesParts: string[] = [];
    const senses = this.senses;
    Object.keys(senses).forEach(key => {
      const value = (senses as any)[key];
      if (value !== undefined && value !== null) {
        if (key === 'passive_perception') {
          sensesParts.push(`passive Perception ${value}`);
        } else {
          sensesParts.push(`${key} ${value}`);
        }
      }
    });
    return sensesParts.join(', ');
  }

  getFormattedStrings(prefix: string): string {
    const filteredProficiencies = this.proficiencies.filter(p =>
      p.proficiency.index.startsWith(prefix)
    );
    return filteredProficiencies
      .map(st => {
        const ability = st.proficiency.name.split(':')[1]?.trim() || '';
        return `${ability} ${this.nts.transform(st.value)}`;
      })
      .join(', ');
  }

  getSavingThrowsString(): string {
    return this.getFormattedStrings('saving-throw');
  }

  getSkillsString(): string {
    return this.getFormattedStrings('skill');
  }
}
