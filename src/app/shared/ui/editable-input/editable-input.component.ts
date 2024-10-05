import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NumberToStringPipe } from '../../pipes/number-to-string.pipe';

@Component({
  selector: 'app-editable-input',
  standalone: true,
  imports: [CommonModule, FormsModule, NumberToStringPipe],
  templateUrl: './editable-input.component.html',
  styleUrl: './editable-input.component.scss',
})
export class EditableInputComponent {
  @Input() editMode: boolean = false;
  @Input() useNumberSign: boolean = false;
  @Input() value: string | number = '';
  @Input() type: 'text' | 'number' = 'text';
  @Input() prefix: string = '';
  @Input() suffix: string = '';
  @Output() valueChange: EventEmitter<string | number> = new EventEmitter<
    string | number
  >();

  onValueChange(newValue: string | number) {
    this.valueChange.emit(String(newValue));
  }
}
