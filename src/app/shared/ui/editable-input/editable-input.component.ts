import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  PipeTransform,
} from '@angular/core';
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
  @Input() type: 'text' | 'number' = 'text';
  @Input() prefix: string = '';
  @Input() suffix: string = '';
  @Input() valuePipe: PipeTransform | null = null;

  private _value: string | number = '';

  @Input()
  set value(val: string | number) {
    this._value = this.type === 'number' ? Number(val) : String(val);
    this.valueChange.emit(this._value);
  }

  get value(): string | number {
    return this._value;
  }

  @Output() valueChange: EventEmitter<string | number> = new EventEmitter<
    string | number
  >();

  get displayValue(): string {
    if (this.type === 'number' && this.valuePipe) {
      return String(this.valuePipe.transform(this._value));
    }
    return String(this._value);
  }

  get inputValue(): string | number {
    return this.type === 'number' ? Number(this._value) : this._value;
  }

  onValueChange(newValue: string | number) {
    this.value = newValue;
  }
}
