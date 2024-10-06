import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TaperedRuleComponent } from '../../../shared/ui/tapered-rule/tapered-rule.component';
import { createNumberEmitter } from '../../../utils/number-emitter.util';
import { EditableInputComponent } from '../../../shared/ui/editable-input/editable-input.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-abilities',
  standalone: true,
  imports: [TaperedRuleComponent, EditableInputComponent, CommonModule],
  templateUrl: './abilities.component.html',
  styleUrl: './abilities.component.scss',
})
export class AbilitiesComponent {
  @Input() strength: number = 10;
  @Input() dexterity: number = 10;
  @Input() constitution: number = 10;
  @Input() intelligence: number = 10;
  @Input() wisdom: number = 10;
  @Input() charisma: number = 10;
  @Input() editMode: boolean = false;

  @Output() strengthChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() dexterityChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() constitutionChange: EventEmitter<number> =
    new EventEmitter<number>();
  @Output() intelligenceChange: EventEmitter<number> =
    new EventEmitter<number>();
  @Output() wisdomChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() charismaChange: EventEmitter<number> = new EventEmitter<number>();

  onStrenghtChange = createNumberEmitter(this.strengthChange);
  onDexterityChange = createNumberEmitter(this.dexterityChange);
  onConstitutionChange = createNumberEmitter(this.constitutionChange);
  onIntelligenceChange = createNumberEmitter(this.intelligenceChange);
  onWisdomChange = createNumberEmitter(this.wisdomChange);
  onCharismaChange = createNumberEmitter(this.charismaChange);

  getModifier(score: number): string {
    const modifier = Math.floor((score - 10) / 2);
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
  }
}
