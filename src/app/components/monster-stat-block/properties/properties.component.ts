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
  CONDITIONS_OPTIONS,
  DAMAGE_SOURCES_TAGS,
  SAVING_THROWS_OPTIONS,
  SENSES_OPTIONS,
  SKILLS_OPTIONS,
} from '../../../config/option-configs';
import { EditableSelectComponent } from '../../../shared/ui/editable-select/editable-select.component';
import { EditableListComponent } from '../../../shared/ui/editable-list/editable-list.component';
import { SensesFormatPipe } from '../../../shared/pipes/senses-format.pipe';
import { EditableInputComponent } from '../../../shared/ui/editable-input/editable-input.component';
import { createNumberEmitter } from '../../../utils/number-emitter.util';

@Component({
  selector: 'app-properties',
  standalone: true,
  imports: [
    CommonModule,
    TaperedRuleComponent,
    EditableCheckboxListComponent,
    EditableSelectComponent,
    EditableListComponent,
    EditableInputComponent,
  ],
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PropertiesComponent {
  readonly savingThrowsOptions = SAVING_THROWS_OPTIONS;
  readonly skillsOptions = SKILLS_OPTIONS;
  readonly damageSourcesTags = DAMAGE_SOURCES_TAGS;
  readonly conditionsOptions = CONDITIONS_OPTIONS;
  readonly sensesOptions = SENSES_OPTIONS;

  @Input() editMode = false;
  @Input() id = '';
  @Input() proficiencies: MonsterProficiency[] = [];
  @Input() damageImmunities: string[] = [];
  @Input() damageVulnerabilities: string[] = [];
  @Input() damageResistances: string[] = [];
  @Input() conditionImmunities: ConditionImmunities[] = [];
  @Input() senses: Senses = { passive_perception: 0 };
  @Input() languages = '';
  @Input() challengeRating = 0;
  @Input() xp = 0;

  @Output() proficienciesChange = new EventEmitter<MonsterProficiency[]>();
  @Output() conditionImmunitiesChange = new EventEmitter<
    ConditionImmunities[]
  >();
  @Output() damageImmunitiesChange = new EventEmitter<string[]>();
  @Output() damageVulnerabilitiesChange = new EventEmitter<string[]>();
  @Output() damageResistancesChange = new EventEmitter<string[]>();
  @Output() sensesChange = new EventEmitter<{
    [key: string]: string | number | boolean;
  }>();
  @Output() languagesChange = new EventEmitter<string>();
  @Output() challengeRatingChange = new EventEmitter<number>();
  @Output() xpChange = new EventEmitter<number>();

  readonly savingThrowFormatPipe = new SavingThrowFormatPipe();
  readonly numberToStringPipe = new NumberToStringPipe();
  readonly skillFormatPipe = new SkillFormatPipe();
  readonly sensesFormatPipe = new SensesFormatPipe();

  onChallengeRatingChange = createNumberEmitter(this.challengeRatingChange);
  onXpChange = createNumberEmitter(this.xpChange);
  get sensesItems() {
    return this.senses as Record<string, string | number>;
  }

  onDamageImmunitiesChange($event: string[]): void {
    this.damageImmunitiesChange.emit($event);
  }

  onDamageVulnerabilitiesChange($event: string[]): void {
    this.damageVulnerabilitiesChange.emit($event);
  }

  onDamageResistancesChange($event: string[]): void {
    this.damageResistancesChange.emit($event);
  }

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

  get conditionImmunitiesRecord(): Record<string, boolean> {
    return this.conditionImmunities.reduce(
      (acc, condition) => {
        acc[condition.index] = true;
        return acc;
      },
      {} as Record<string, boolean>
    );
  }

  onConditionImmunitiesChange(
    record: Record<string, string | number | boolean>
  ): void {
    const newConditionImmunities = Object.keys(record)
      .filter(key => record[key] === true)
      .map(index => ({
        index: index,
        name: index.charAt(0).toUpperCase() + index.slice(1),
        url: `/api/conditions/${index}`,
      }));

    this.conditionImmunities = newConditionImmunities;
    this.conditionImmunitiesChange.emit(this.conditionImmunities);
  }

  isRecordEmpty(record: Record<string, string | number | boolean>): boolean {
    return Object.keys(record).length === 0 && !this.editMode;
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
    this.savingThrows = this.assertToNumberRecord(values);
  }

  onSkillsChange(values: Record<string, string | number | boolean>): void {
    this.skills = this.assertToNumberRecord(values);
  }

  private assertToNumberRecord(
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
