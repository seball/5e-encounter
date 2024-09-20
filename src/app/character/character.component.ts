import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-character',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.scss']
})
export class CharacterComponent {
  @Input() maxHp: number = 100;
  @Input() initiativeModifier: number = 0;

  currentHp: number = this.maxHp;
  initiative: number = 0;
  hpAdjustment: number = 0;

  adjustInitiative(value: number): void {
    this.initiative += value;
  }

  heal(): void {
    this.currentHp = Math.min(this.currentHp + this.hpAdjustment, this.maxHp);
    this.hpAdjustment = 0;
  }

  damage(): void {
    this.currentHp = Math.max(this.currentHp - this.hpAdjustment, 0);
    this.hpAdjustment = 0;
  }
}