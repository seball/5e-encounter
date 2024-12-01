import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  EventEmitter,
  Output,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-export-encounter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './export-encounter.component.html',
  styleUrl: './export-encounter.component.scss',
})
export class ExportEncounterComponent {
  private filenameSignal = signal<string>('');
  readonly filename = computed(() => this.filenameSignal());

  @Output() exportRequested = new EventEmitter<string>();

  updateFilename(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.filenameSignal.set(input.value);
  }

  export(): void {
    if (this.filename()) {
      this.exportRequested.emit(this.filename());
    }
  }
}
