import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ElementRef,
  AfterViewInit,
  ViewEncapsulation,
} from '@angular/core';
import UseBootstrapTag from 'use-bootstrap-tag';

export interface TagButton {
  name: string;
  color: string;
}

interface UseBootstrapTagReturnType {
  getValue: () => string;
  getValues: () => string[];
  addValue: (value: string | string[]) => void;
  removeValue: (value: string | string[]) => void;
}

@Component({
  selector: 'app-editable-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './editable-list.component.html',
  styleUrls: ['./editable-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class EditableListComponent implements AfterViewInit {
  @ViewChild('tagInput') private tagInputElement!: ElementRef<HTMLInputElement>;

  private _items: string[] = [];
  @Input() set items(value: string[]) {
    if (this.areArraysDifferent(this._items, value)) {
      this._items = value;
    }
  }
  get items(): string[] {
    return this._items;
  }

  @Input() editMode = false;
  @Input() separator?: string;
  @Input() allowDuplicates = false;
  @Input() transform = '';
  @Input() variant = '';
  @Input() xPosition: 'left' | 'right' = 'right';
  @Input() maxTags?: number;
  @Input() noInputOnBlur = false;
  @Input() tagOptions: TagButton[] = [];
  @Input() tagLabelKey = 'name';
  @Input() tagColorKey = 'color';

  @Output() onValueChange = new EventEmitter<string[]>();

  private tagInput: UseBootstrapTagReturnType | null = null;

  ngAfterViewInit(): void {
    this.initializeTagInput();
  }

  private initializeTagInput(): void {
    this.tagInput = UseBootstrapTag(this.tagInputElement.nativeElement);
    this.updateTagInputValues();
    this.tagInputElement.nativeElement.addEventListener(
      'change',
      this.onInputChange.bind(this)
    );
    this.tagInputElement.nativeElement.addEventListener(
      'itemAdded',
      this.onInputChange.bind(this)
    );
    this.tagInputElement.nativeElement.addEventListener(
      'itemRemoved',
      this.onInputChange.bind(this)
    );
  }

  private updateTagInputValues(): void {
    if (!this.tagInput) return;

    const currentValues = this.tagInput.getValues();
    if (this.areArraysDifferent(this._items, currentValues)) {
      this.tagInput.removeValue(currentValues);
      this._items.forEach(item => this.tagInput?.addValue(item));
    }
  }

  private onInputChange(): void {
    const currentValues = this.getValues();
    if (this.areArraysDifferent(currentValues, this._items)) {
      this._items = currentValues;
      this.onValueChange.emit(this._items);
    }
  }

  addTag(tagName: string): void {
    if (
      this.tagInput &&
      (!this._items.includes(tagName) || this.allowDuplicates)
    ) {
      this.tagInput.addValue(tagName);
      this.onInputChange();
    }
  }

  removeTag(tagName: string): void {
    if (this.tagInput && this._items.includes(tagName)) {
      this.tagInput.removeValue(tagName);
      this.onInputChange();
    }
  }

  isTagSelected(tagName: string): boolean {
    return this._items.includes(tagName);
  }

  private getValues(): string[] {
    return this.tagInput?.getValues() ?? [];
  }

  private areArraysDifferent(arr1: string[], arr2: string[]): boolean {
    return (
      arr1.length !== arr2.length ||
      arr1.some((value, index) => value !== arr2[index])
    );
  }
}
