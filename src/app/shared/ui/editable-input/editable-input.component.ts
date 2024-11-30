import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  PipeTransform,
  HostListener,
  OnDestroy,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

type InputType = 'text' | 'number';

@Component({
  selector: 'app-editable-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editable-input.component.html',
  styleUrls: ['./editable-input.component.scss'],
})
export class EditableInputComponent implements OnDestroy {
  @Input() editMode = false;
  @Input() type: InputType = 'text';
  @Input() prefix = '';
  @Input() suffix = '';
  @Input() valuePipe: PipeTransform | null = null;
  @Input() step = 1;
  @Input() maxLength: number | null = null;
  @Output() readonly valueChange = new EventEmitter<string | number>();

  private _value: string | number = '';
  private _isFocused = false;
  private readonly wheelHandler: (event: WheelEvent) => void;
  private static readonly MIN_VALUE = 0;

  constructor() {
    this.wheelHandler = this.handleWheel.bind(this);
  }

  @Input()
  set value(val: string | number) {
    const formattedValue = this.formatValue(val);
    this._value =
      this.type === 'number'
        ? Math.max(Number(formattedValue), EditableInputComponent.MIN_VALUE)
        : formattedValue;
    this.valueChange.emit(this._value);
  }

  get value(): string | number {
    return this._value;
  }

  get displayValue(): string {
    return this.isNumberWithPipe
      ? String(this.valuePipe!.transform(this._value))
      : String(this._value);
  }

  get inputValue(): string | number {
    return this.type === 'number' ? Number(this._value) : this._value;
  }

  private get isNumberWithPipe(): boolean {
    return this.type === 'number' && !!this.valuePipe;
  }

  @HostListener('focusin')
  onFocusIn(): void {
    this._isFocused = true;
    this.addWheelListener();
  }

  @HostListener('focusout')
  onFocusOut(): void {
    this._isFocused = false;
    this.removeWheelListener();
  }

  ngOnDestroy(): void {
    this.removeWheelListener();
  }

  onValueChange(newValue: string | number): void {
    this.value = newValue;
  }

  private formatValue(val: string | number): string | number {
    return this.type === 'number' ? Number(val) : String(val);
  }

  private handleWheel(event: WheelEvent): void {
    if (!this.isWheelEventValid()) return;

    event.preventDefault();
    const newValue = this.calculateNewValue(event);
    if (this.hasValueChanged(newValue)) {
      this.value = newValue;
    }
  }

  private isWheelEventValid(): boolean {
    return this.type === 'number' && this._isFocused;
  }

  private calculateNewValue(event: WheelEvent): number {
    const currentValue = Number(this._value) || 0;
    const delta = event.deltaY < 0 ? this.step : -this.step;
    return Math.max(currentValue + delta, EditableInputComponent.MIN_VALUE);
  }

  private hasValueChanged(newValue: number): boolean {
    return newValue !== Number(this._value);
  }

  private addWheelListener(): void {
    window.addEventListener('wheel', this.wheelHandler, { passive: false });
  }

  private removeWheelListener(): void {
    window.removeEventListener('wheel', this.wheelHandler);
  }
}
