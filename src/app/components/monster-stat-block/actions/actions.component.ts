import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Action } from '../../../interfaces/statblock.interface';
import { EditableNameDescriptionArrayComponent } from '../../../shared/ui/editable-name-description-array/editable-name-description-array.component';

@Component({
  selector: 'app-actions',
  standalone: true,
  imports: [CommonModule, EditableNameDescriptionArrayComponent],
  templateUrl: './actions.component.html',
  styleUrl: './actions.component.scss',
})
export class ActionsComponent {
  @Input() actions: Action[] = [];
  @Input() editMode = false;
  @Output() actionsChange = new EventEmitter<Action[]>();

  onActionsChange(newActions: Action[]) {
    this.actionsChange.emit(newActions);
  }
}
