import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Action } from '../../../interfaces/statblock.interface';
import { EditableNameDescriptionArrayComponent } from '../../../shared/ui/editable-name-description-array/editable-name-description-array.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lair-actions',
  standalone: true,
  imports: [EditableNameDescriptionArrayComponent, CommonModule],
  templateUrl: './lair-actions.component.html',
  styleUrl: './lair-actions.component.scss',
})
export class LairActionsComponent {
  @Input({
    required: false,
    transform: (value: Action[] | undefined | null) => value ?? [],
  })
  lairActions: Action[] = [];
  @Input() editMode = false;
  @Output() lairActionsChange = new EventEmitter<Action[]>();

  onLairActionsChange(newActions: Action[]) {
    this.lairActionsChange.emit(newActions);
  }
}
