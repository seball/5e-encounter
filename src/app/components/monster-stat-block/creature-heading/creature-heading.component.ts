import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { TaperedRuleComponent } from '../../../shared/ui/tapered-rule/tapered-rule.component';
import { EditableInputComponent } from '../../../shared/ui/editable-input/editable-input.component';
import { EditableSelectComponent } from '../../../shared/ui/editable-select/editable-select.component';
import { createStringEmitter } from '../../../utils/string-emitter.util';
import { CommonModule } from '@angular/common';
import {
  ALIGNMENTS,
  MONSTER_TYPES,
  SIZES,
} from '../../../config/option-configs';

@Component({
  selector: 'app-creature-heading',
  templateUrl: './creature-heading.component.html',
  styleUrl: './creature-heading.component.scss',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    TaperedRuleComponent,
    EditableInputComponent,
    EditableSelectComponent,
  ],
})
export class CreatureHeadingComponent {
  sizes = SIZES;
  monsterTypes = MONSTER_TYPES;
  aligments = ALIGNMENTS;

  @Input() editMode: boolean = false;
  @Input() name: string = '';
  @Input() size: string = '';
  @Input() type: string = '';
  @Input() alignment: string = '';

  @Output() nameChange = new EventEmitter<string>();
  @Output() sizeChange = new EventEmitter<string>();
  @Output() typeChange = new EventEmitter<string>();
  @Output() alignmentChange = new EventEmitter<string>();

  onNameChange = createStringEmitter(this.nameChange);
  onSizeChange = createStringEmitter(this.sizeChange);
  onTypeChange = createStringEmitter(this.typeChange);
  onAlignmentChange = createStringEmitter(this.alignmentChange);
}
