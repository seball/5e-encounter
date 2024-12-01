import {
  Component,
  computed,
  EventEmitter,
  Output,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-save-battlefield',
  standalone: true,
  imports: [],
  templateUrl: './save-battlefield.component.html',
  styleUrl: './save-battlefield.component.scss',
})
export class SaveBattlefieldComponent {
  private nameSignal = signal<string>('');
  readonly name = computed(() => this.nameSignal());

  @Output() saveRequested = new EventEmitter<string>();

  updateName(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.nameSignal.set(input.value);
  }

  save(): void {
    if (this.name()) {
      this.saveRequested.emit(this.name());
      this.nameSignal.set('');
    }
  }
}
