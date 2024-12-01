import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ArrowUpIcon, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-expandable-textbox',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './expandable-textbox.component.html',
  styleUrl: './expandable-textbox.component.scss',
})
export class ExpandableTextboxComponent implements AfterViewInit {
  @ViewChild('textareaElement') textareaRef!: ElementRef<HTMLTextAreaElement>;
  @Output() submit = new EventEmitter<string>();
  @Input() placeholder: string = 'Type here...';

  enterIcon = ArrowUpIcon;
  text: string = '';

  get isDisabled(): boolean {
    return !this.text.trim();
  }

  ngAfterViewInit() {
    if (this.textareaRef) {
      this.adjustHeight();
    }
  }

  adjustHeight(): void {
    if (!this.textareaRef?.nativeElement) return;

    const textarea = this.textareaRef.nativeElement;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  handleSubmit(): void {
    if (this.isDisabled) return;

    const trimmedText = this.text.trim();
    const textToSubmit = trimmedText;
    this.text = '';
    this.triggerSubmit(textToSubmit);
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      if (!event.shiftKey) {
        event.preventDefault();
        this.handleSubmit();
      } else {
        this.triggerHeightAdjustment();
      }
    }
  }

  triggerHeightAdjustment(): void {
    requestAnimationFrame(() => {
      if (this.textareaRef) {
        this.adjustHeight();
      }
    });
  }

  triggerSubmit(textToSubmit: string): void {
    requestAnimationFrame(() => {
      if (this.textareaRef) {
        this.adjustHeight();
        this.textareaRef.nativeElement.blur();
        this.submit.emit(textToSubmit);
      }
    });
  }
}
