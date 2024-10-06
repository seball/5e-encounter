import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { TaperedRuleComponent } from '../../../shared/ui/tapered-rule/tapered-rule.component';
import { EditableCheckboxListComponent } from '../../../shared/ui/editable-checkbox-list/editable-checkbox-list.component';
import { EditableCheckboxComponent } from '../../../shared/ui/editable-checkbox/editable-checkbox.component';
import { Speed } from '../../../interfaces/statblock.interface';
import { CommonModule } from '@angular/common';
import { EditableInputComponent } from '../../../shared/ui/editable-input/editable-input.component';
import { createStringEmitter } from '../../../utils/string-emitter.util';
import { createNumberEmitter } from '../../../utils/number-emitter.util';
import { SPEED_OPTIONS } from '../../../config/option-configs';

@Component({
  selector: 'app-top-stats',
  standalone: true,
  imports: [
    TaperedRuleComponent,
    EditableCheckboxListComponent,
    EditableCheckboxComponent,
    CommonModule,
    EditableInputComponent,
  ],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './top-stats.component.html',
  styleUrl: './top-stats.component.scss',
})
export class TopStatsComponent {
  readonly speedOptions = SPEED_OPTIONS;

  @Input() editMode: boolean = false;
  @Input() armorClass: number = 0;
  @Input() armorType: string = '';
  @Input() hitPoints: number = 0;
  @Input() hitDice: string = '';
  @Input() speed: Speed = {};
  @Input() id: string = '';

  @Output() speedChange = new EventEmitter<{
    [key: string]: string | number | boolean;
  }>();

  @Output() armorClassChange = new EventEmitter<number>();
  @Output() armorTypeChange = new EventEmitter<string>();
  @Output() hitPointsChange = new EventEmitter<number>();
  @Output() hitDiceChange = new EventEmitter<string>();

  onArmorClassChange = createNumberEmitter(this.armorClassChange);
  onArmorTypeChange = createStringEmitter(this.armorTypeChange);
  onHitPointsChange = createNumberEmitter(this.hitPointsChange);
  onHitDiceChange = createStringEmitter(this.hitDiceChange);

  get speedItems() {
    return this.speed as { [key: string]: string | number | boolean };
  }
}
