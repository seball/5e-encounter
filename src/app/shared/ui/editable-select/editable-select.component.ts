import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
  selector: 'app-editable-select',
  standalone: true,
  imports: [CommonModule, NgSelectComponent, FormsModule],
  templateUrl: './editable-select.component.html',
  styleUrl: './editable-select.component.scss',
})
export class EditableSelectComponent<T> {
  @Input() items: T[] = [];
  @Input() placeholder: string = 'item...';
  @Input() editMode: boolean = false;

  @Input() value: T | null = null;
  @Output() valueChange: EventEmitter<T | null> = new EventEmitter<T | null>();

  onSelect(selectedValue: T | null) {
    this.value = selectedValue;
    this.valueChange.emit(selectedValue);
  }

  get displayValue(): string {
    if (!this.value) {
      return this.placeholder;
    }
    return String(this.value);
  }
}
