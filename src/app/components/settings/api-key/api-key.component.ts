import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  EventEmitter,
  Output,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-api-key',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './api-key.component.html',
  styleUrl: './api-key.component.scss',
})
export class ApiKeyComponent {
  private apiKeySignal = signal<string>('');
  readonly apiKey = computed(() => this.apiKeySignal());
  @Output() saveRequested = new EventEmitter<string>();

  updateApiKey(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.apiKeySignal.set(input.value);
  }

  save(): void {
    if (this.apiKey()) {
      this.saveRequested.emit(this.apiKey());
      this.apiKeySignal.set('');
    }
  }
}
