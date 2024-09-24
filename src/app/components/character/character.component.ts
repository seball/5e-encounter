import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NumberToStringPipe } from '../../shared/pipes/number-to-string.pipe';
import { Character } from '../../interfaces/character.interface';

@Component({
  selector: 'app-character',
  standalone: true,
  imports: [CommonModule, FormsModule, NumberToStringPipe],
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.scss'],
})
export class CharacterComponent {
  @Input() character!: Character;

  editMode: boolean = false;
  hpAdjustment: number = 0;

  ngOnInit() {
    if (!this.character) {
      console.error('Character input is required for CharacterComponent');
    }
  }

  heal(): void {
    this.character.currentHp = Math.min(
      this.character.currentHp + this.hpAdjustment,
      this.character.maxHp
    );
    this.hpAdjustment = 0;
  }

  damage(): void {
    this.character.currentHp = Math.max(
      this.character.currentHp - this.hpAdjustment,
      0
    );
    this.hpAdjustment = 0;
  }

  save(): void {
    this.editMode = false;
  }

  enterEditMode(): void {
    this.editMode = true;
  }

  handleEnterKey(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.save();
    }
  }
}
