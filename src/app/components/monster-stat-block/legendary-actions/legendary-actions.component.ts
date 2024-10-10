import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Action } from '../../../interfaces/statblock.interface';
import { EditableNameDescriptionArrayComponent } from '../../../shared/ui/editable-name-description-array/editable-name-description-array.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-legendary-actions',
  standalone: true,
  imports: [EditableNameDescriptionArrayComponent, CommonModule],
  templateUrl: './legendary-actions.component.html',
  styleUrl: './legendary-actions.component.scss',
})
export class LegendaryActionsComponent {
  @Input() legendaryActions: Action[] = [];
  @Input() editMode = false;
  @Output() legendaryActionsChange = new EventEmitter<Action[]>();

  onLegendaryActionsChange(newActions: Action[]) {
    this.legendaryActionsChange.emit(newActions);
  }
}
