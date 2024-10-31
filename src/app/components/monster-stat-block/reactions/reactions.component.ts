import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Action } from '../../../interfaces/statblock.interface';
import { EditableNameDescriptionArrayComponent } from '../../../shared/ui/editable-name-description-array/editable-name-description-array.component';

@Component({
  selector: 'app-reactions',
  standalone: true,
  imports: [CommonModule, EditableNameDescriptionArrayComponent],
  templateUrl: './reactions.component.html',
  styleUrl: './reactions.component.scss',
})
export class ReactionsComponent {
  @Input() reactions: Action[] = [];
  @Input() editMode = false;
  @Output() reactionsChange = new EventEmitter<Action[]>();

  onReactionsChange(newReactions: Action[]) {
    this.reactionsChange.emit(newReactions);
  }
}
