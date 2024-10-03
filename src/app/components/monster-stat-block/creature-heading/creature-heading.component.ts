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

@Component({
  selector: 'app-creature-heading',
  templateUrl: './creature-heading.component.html',
  styleUrl: './creature-heading.component.scss',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    TaperedRuleComponent,
    EditableInputComponent,
    EditableSelectComponent,
  ],
})
export class CreatureHeadingComponent {
  @Input() editMode: boolean = false;
  @Input() name: string = '';
  @Input() size: string = '';
  @Input() type: string = '';
  @Input() alignment: string = '';

  @Output() nameChange = new EventEmitter<string>();
  @Output() sizeChange = new EventEmitter<string>();
  @Output() typeChange = new EventEmitter<string>();
  @Output() alignmentChange = new EventEmitter<string>();

  sizeTypes = ['Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan'];
  monsterTypes = [
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
  alignmentTypes = [
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
}
