import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  PipeTransform,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EditableInputComponent } from '../editable-input/editable-input.component';
import { EditableCheckboxComponent } from '../editable-checkbox/editable-checkbox.component';

type InputType = 'text' | 'number' | 'checkbox';

export interface OptionConfig {
  [key: string]: InputType;
}

interface CheckboxItem {
  key: string;
  value: string | number | boolean;
  checked: boolean;
  type: InputType;
}

@Component({
  selector: 'app-editable-checkbox-list',
  standalone: true,
  imports: [
    CommonModule,
    EditableInputComponent,
    EditableCheckboxComponent,
    FormsModule,
  ],
  templateUrl: './editable-checkbox-list.component.html',
  styleUrls: ['./editable-checkbox-list.component.scss'],
})
export class EditableCheckboxListComponent implements OnInit, OnChanges {
  @Input() items: Record<string, string | number | boolean> = {};
  @Input() editMode = false;
  @Input() availableOptions: OptionConfig = {};
  @Input() sessionId = '';
  @Input() displayKeyPipe: PipeTransform | null = null;
  @Input() displayValuePipe: PipeTransform | null = null;
  @Output() itemsChange = new EventEmitter<
    Record<string, string | number | boolean>
  >();

  allItems: CheckboxItem[] = [];

  ngOnInit(): void {
    this.initializeAllItems();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['sessionId']) {
      this.initializeAllItems();
    }
  }

  initializeAllItems(): void {
    const itemEntries = Object.entries(this.items);
    const optionEntries = Object.entries(this.availableOptions);
    const existingKeys = new Set(itemEntries.map(([key]) => key));

    this.allItems = [
      ...this.createExistingItems(itemEntries),
      ...this.createMissingItems(optionEntries, existingKeys),
    ];
  }

  onItemChange(item: CheckboxItem): void {
    if (item.type === 'checkbox') {
      item.value = item.checked;
    }
    this.updateItems();
  }

  onValueChange(key: string, newValue: string | number | boolean): void {
    const item = this.allItems.find(item => item.key === key);
    if (item) {
      item.value = newValue;
      this.updateItems();
    }
  }

  updateItems(): void {
    const updatedItems = this.allItems.reduce(
      (acc, item) => {
        if (item.checked && (item.type !== 'checkbox' || item.value === true)) {
          acc[item.key] = item.value;
        }
        return acc;
      },
      {} as Record<string, string | number | boolean>
    );

    this.itemsChange.emit(updatedItems);
  }

  getDefaultValueForType(type: InputType): string | number | boolean {
    const defaultValues: Record<InputType, string | number | boolean> = {
      checkbox: false,
      number: 0,
      text: '...',
    };
    return defaultValues[type];
  }

  getInputType(value: string | number | boolean): InputType {
    if (typeof value === 'boolean') return 'checkbox';
    return typeof value === 'number' ? 'number' : 'text';
  }

  getStringValue(item: CheckboxItem): string {
    return item.value as string;
  }

  getNumberValue(item: CheckboxItem): number {
    return item.value as number;
  }

  shouldDisplayItem(item: CheckboxItem): boolean {
    return item.checked;
  }

  getItemKeyToString(item: CheckboxItem): string {
    return item.type !== 'checkbox' ? item.key : `(${item.key})`;
  }

  isLastDisplayedItem(item: CheckboxItem): boolean {
    const displayedItems = this.allItems.filter(i => this.shouldDisplayItem(i));
    return displayedItems[displayedItems.length - 1] === item;
  }

  getItemKeytoString(item: CheckboxItem): string {
    return item.type !== 'checkbox' ? item.key : `(${item.key})`;
  }

  private createExistingItems(
    itemEntries: [string, string | number | boolean][]
  ): CheckboxItem[] {
    return itemEntries.map(([key, value]) => ({
      key,
      value,
      checked: true,
      type: this.getInputType(value),
    }));
  }

  private createMissingItems(
    optionEntries: [string, InputType][],
    existingKeys: Set<string>
  ): CheckboxItem[] {
    return optionEntries
      .filter(([key]) => !existingKeys.has(key))
      .map(([key, type]) => ({
        key,
        value: this.getDefaultValueForType(type),
        checked: false,
        type,
      }));
  }

  getDisplayValue(key: string): string {
    if (this.displayKeyPipe) {
      return this.displayKeyPipe.transform(`${key}`);
    }
    return key;
  }
}
