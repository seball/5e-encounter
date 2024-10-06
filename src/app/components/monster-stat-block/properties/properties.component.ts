import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaperedRuleComponent } from '../../../shared/ui/tapered-rule/tapered-rule.component';
import {
  EditableCheckboxListComponent,
  OptionConfig,
} from '../../../shared/ui/editable-checkbox-list/editable-checkbox-list.component';
import { NumberToStringPipe } from '../../../shared/pipes/number-to-string.pipe';
import { SavingThrowFormatPipe } from '../../../shared/pipes/saving-throw-format.pipe';
import { SkillFormatPipe } from '../../../shared/pipes/skill-format.pipe';
import {
  ConditionImmunities,
  MonsterProficiency,
  Senses,
} from '../../../interfaces/statblock.interface';
import {
  SAVING_THROWS_OPTIONS,
  SKILLS_OPTIONS,
} from '../../../config/option-configs';

@Component({
  selector: 'app-properties',
  standalone: true,
  imports: [CommonModule, TaperedRuleComponent, EditableCheckboxListComponent],
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PropertiesComponent {
  readonly savingThrowsOptions = SAVING_THROWS_OPTIONS;
  readonly skillsOptions = SKILLS_OPTIONS;

  @Input() editMode = false;
  @Input() id = '';
  @Input() proficiencies: MonsterProficiency[] = [];
  @Input() damageImmunities: string[] = [];
  @Input() conditionImmunities: ConditionImmunities[] = [];
  @Input() senses: Senses = { passive_perception: 0 };
  @Input() languages = '';
  @Input() challengeRating = 0;
  @Input() xp = 0;

  @Output() proficienciesChange = new EventEmitter<MonsterProficiency[]>();

  readonly savingThrowFormatPipe = new SavingThrowFormatPipe();
  readonly numberToStringPipe = new NumberToStringPipe();
  readonly skillFormatPipe = new SkillFormatPipe();

  get savingThrows(): Record<string, number> {
    return this.getProficienciesByType('saving-throw-');
  }

  set savingThrows(values: Record<string, number>) {
    this.updateProficiencies(
      values,
      'saving-throw-',
      this.savingThrowsOptions,
      'Saving Throw'
    );
  }

  get skills(): Record<string, number> {
    return this.getProficienciesByType('skill-');
  }

  set skills(values: Record<string, number>) {
    this.updateProficiencies(values, 'skill-', this.skillsOptions, 'Skill');
  }

  get languagesString(): string {
    return this.languages || '--';
  }

  isRecordEmpty(record: Record<string, string | number | boolean>): boolean {
    return Object.keys(record).length === 0 && !this.editMode;
  }

  getDamageImmunitiesString(): string {
    return this.damageImmunities.join(', ');
  }

  getConditionImmunitiesString(): string {
    return this.conditionImmunities.map(c => c.name).join(', ');
  }

  getSensesString(): string {
    return Object.entries(this.senses)
      .filter(([, value]) => value != null)
      .map(([key, value]) =>
        key === 'passive_perception'
          ? `passive Perception ${value}`
          : `${key} ${value}`
      )
      .join(', ');
  }

  getFormattedStrings(prefix: string): string {
    return this.proficiencies
      .filter(p => p.proficiency.index.startsWith(prefix))
      .map(p => {
        const ability = p.proficiency.name.split(':')[1]?.trim() || '';
        return `${ability} ${this.numberToStringPipe.transform(p.value)}`;
      })
      .join(', ');
  }

  onSavingThrowsChange(
    values: Record<string, string | number | boolean>
  ): void {
    this.savingThrows = this.convertToNumberRecord(values);
  }

  onSkillsChange(values: Record<string, string | number | boolean>): void {
    this.skills = this.convertToNumberRecord(values);
  }

  // this will be always a number in this case, don't worry
  private convertToNumberRecord(
    record: Record<string, string | number | boolean>
  ): Record<string, number> {
    return record as Record<string, number>;
  }

  private getProficienciesByType(prefix: string): Record<string, number> {
    return this.proficiencies
      .filter(prof => prof.proficiency.index.startsWith(prefix))
      .reduce(
        (acc, prof) => {
          acc[prof.proficiency.index] = prof.value;
          return acc;
        },
        {} as Record<string, number>
      );
  }

  private updateProficiencies(
    values: Record<string, number>,
    prefix: string,
    options: OptionConfig,
    type: string
  ): void {
    const updatedProficiencies = this.proficiencies.filter(
      prof => !prof.proficiency.index.startsWith(prefix)
    );

    Object.entries(values).forEach(([index, value]) => {
      if (Object.prototype.hasOwnProperty.call(options, index)) {
        const name = index.split('-').slice(1).join('-');
        updatedProficiencies.push({
          value: Number(value),
          proficiency: {
            index,
            name: `${type}: ${name.charAt(0).toUpperCase() + name.slice(1)}`,
            url: `/api/proficiencies/${index}`,
          },
        });
      }
    });

    this.proficiencies = updatedProficiencies;
    this.proficienciesChange.emit(this.proficiencies);
  }
}
