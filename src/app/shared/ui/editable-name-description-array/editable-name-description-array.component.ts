import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Action } from '../../../interfaces/statblock.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, PlusIcon } from 'lucide-angular';
import { XIcon } from 'lucide-angular/src/icons';

type UsageType =
  | 'none'
  | 'per day'
  | 'recharge on roll'
  | 'recharge after rest';

interface UsageValues {
  'per day': number;
  'recharge on roll': number;
  'recharge after rest': string[];
}

@Component({
  selector: 'app-editable-name-description-array',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './editable-name-description-array.component.html',
  styleUrls: ['./editable-name-description-array.component.scss'],
})
export class EditableNameDescriptionArrayComponent implements OnChanges {
  @Input() editMode = false;
  @Input() items: Action[] = [];
  @Output() itemsChange = new EventEmitter<Action[]>();
  @Input() buttonText = 'Add New';

  readonly deleteIcon = XIcon;
  readonly addIcon = PlusIcon;

  usageTypes: UsageType[] = [
    'none',
    'per day',
    'recharge on roll',
    'recharge after rest',
  ];
  restTypes: ('short' | 'long')[] = ['short', 'long'];

  private previousUsageValues: Map<Action, Partial<UsageValues>> = new Map();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editMode']) {
      this.emitFilteredItems();
    }
  }

  emitFilteredItems() {
    const items = this.items.filter(item => item.name !== '');
    setTimeout(() => {
      this.itemsChange.emit(items);
    });
  }

  onItemChange() {
    this.itemsChange.emit(this.items);
  }

  addItem() {
    this.items.push({ name: '', desc: '' });
    this.onItemChange();
  }

  removeItem(index: number) {
    const removedItem = this.items[index];
    this.previousUsageValues.delete(removedItem);
    this.items.splice(index, 1);
    this.onItemChange();
  }

  updateUsage(item: Action, usageType: UsageType) {
    this.storePreviousValues(item);

    if (usageType === 'none') {
      delete item.usage;
    } else {
      const previousValues = this.previousUsageValues.get(item) || {};
      item.usage = { type: usageType };

      switch (usageType) {
        case 'per day':
          item.usage.times = previousValues['per day'] || 1;
          break;
        case 'recharge on roll':
          item.usage.min_value = previousValues['recharge on roll'] || 6;
          break;
        case 'recharge after rest':
          item.usage.rest_types = previousValues['recharge after rest'] || [
            'long',
          ];
          break;
      }
    }
    this.onItemChange();
  }

  private storePreviousValues(item: Action) {
    if (!item.usage) return;

    const previousValues = this.previousUsageValues.get(item) || {};

    switch (item.usage.type) {
      case 'per day':
        previousValues['per day'] = item.usage.times || 1;
        break;
      case 'recharge on roll':
        previousValues['recharge on roll'] = item.usage.min_value || 6;
        break;
      case 'recharge after rest':
        previousValues['recharge after rest'] = item.usage.rest_types || [
          'long',
        ];
        break;
    }

    this.previousUsageValues.set(item, previousValues);
  }

  updateUsageTimes(item: Action, value: number) {
    if (item.usage && item.usage.type === 'per day') {
      item.usage.times = value;
      this.storePreviousValues(item);
      this.onItemChange();
    }
  }

  toggleRestType(item: Action, restType: 'short' | 'long') {
    if (item.usage && item.usage.type === 'recharge after rest') {
      if (!item.usage.rest_types) {
        item.usage.rest_types = [restType];
      } else {
        const index = item.usage.rest_types.indexOf(restType);
        if (index > -1) {
          item.usage.rest_types.splice(index, 1);
          if (item.usage.rest_types.length === 0) {
            item.usage.rest_types.push(restType);
          }
        } else {
          item.usage.rest_types.push(restType);
        }
      }
      this.storePreviousValues(item);
      this.onItemChange();
    }
  }

  getUsageType(item: Action): UsageType {
    return item.usage?.type || 'none';
  }

  getRechargeString(value: number | undefined): string {
    if (value === undefined) return '';
    if (value === 6) return '6';
    return `${value}-6`;
  }

  getRestTypeString(rest: string[] | undefined): string {
    if (!rest || rest.length === 0) return '';
    return rest.join(' or ');
  }

  updateUsageMinValue(item: Action, value: number) {
    if (item.usage && item.usage.type === 'recharge on roll') {
      const clampedValue = Math.max(2, Math.min(6, value));
      item.usage.min_value = clampedValue;
      this.storePreviousValues(item);
      this.onItemChange();
    }
  }
}
