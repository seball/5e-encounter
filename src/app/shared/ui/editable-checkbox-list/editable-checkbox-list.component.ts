import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EditableInputComponent } from '../editable-input/editable-input.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-editable-checkbox-list',
  standalone: true,
  imports: [CommonModule, EditableInputComponent, FormsModule],
  templateUrl: './editable-checkbox-list.component.html',
  styleUrl: './editable-checkbox-list.component.scss',
})
export class EditableCheckboxListComponent implements OnInit {
  @Input() items: { [key: string]: string | number } = {};
  @Input() editMode: boolean = false;
  @Output() itemsChange: EventEmitter<{
    [key: string]: string | number;
  }> = new EventEmitter();

  checkboxItems: CheckboxItem[] = [];

  ngOnInit() {
    this.initializeCheckboxItems();
  }

  initializeCheckboxItems() {
    this.checkboxItems = Object.entries(this.items).map(([key, value]) => ({
      key,
      value,
      checked: true,
    }));
  }

  onItemChange() {
    this.updateItems();
  }

  onValueChange(key: string, newValue: string | number) {
    const item = this.checkboxItems.find(item => item.key === key);
    if (item) {
      item.value = newValue;
      this.updateItems();
    }
  }

  updateItems() {
    const updatedItems = this.checkboxItems.reduce(
      (acc, item) => {
        if (item.checked) {
          acc[item.key] = item.value;
        }
        return acc;
      },
      {} as { [key: string]: string | number }
    );

    this.itemsChange.emit(updatedItems);
  }

  getInputType(value: string | number): 'text' | 'number' | 'checkbox' {
    return typeof value === 'number' ? 'number' : 'text';
  }
}

export interface CheckboxItem {
  key: string;
  value: string | number;
  checked: boolean;
}
