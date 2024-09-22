import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-abilities',
  standalone: true,
  imports: [],
  templateUrl: './abilities.component.html',
  styleUrl: './abilities.component.scss'
})
export class AbilitiesComponent {
  @Input() strength: number = 10;
  @Input() dexterity: number = 10;
  @Input() constitution: number = 10;
  @Input() intelligence: number = 10;
  @Input() wisdom: number = 10;
  @Input() charisma: number = 10;

  getModifier(score: number): string {
    const modifier = Math.floor((score - 10) / 2);
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
  }
}
