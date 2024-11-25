import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  PipeTransform,
  HostListener,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-editable-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editable-input.component.html',
  styleUrl: './editable-input.component.scss',
})
export class EditableInputComponent {
  @Input() editMode: boolean = false;
  @Input() type: 'text' | 'number' = 'text';
  @Input() prefix: string = '';
  @Input() suffix: string = '';
  @Input() valuePipe: PipeTransform | null = null;
  @Input() step: number = 1;
  @Input() maxLength: number | null = null;
  private _value: string | number = '';
  private isHovered = false;

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

  @HostListener('mouseenter')
  onMouseEnter() {
    this.isHovered = true;
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.isHovered = false;
  }

  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent) {
    if (this.type !== 'number' || !this.isHovered) {
      return;
    }
    event.preventDefault();
    const currentValue = Number(this._value) || 0;
    const delta = event.deltaY < 0 ? this.step : -this.step;
    const newValue = currentValue + delta;
    if (newValue !== currentValue) {
      this.value = newValue;
    }
  }

  onValueChange(newValue: string | number) {
    if (this.type === 'number') {
      const numValue = Number(newValue);
      this.value = numValue;
    } else {
      this.value = newValue;
    }
  }
}
