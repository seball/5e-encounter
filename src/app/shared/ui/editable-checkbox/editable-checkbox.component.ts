import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-editable-checkbox',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editable-checkbox.component.html',
  styleUrl: './editable-checkbox.component.scss',
})
export class EditableCheckboxComponent {
  @Input() editMode: boolean = false;
  @Input() label: string = '';
  @Input() isChecked: boolean = false;
  @Output() isCheckedChange: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  onCheckboxChange(newValue: boolean) {
    this.isCheckedChange.emit(newValue);
  }
}
