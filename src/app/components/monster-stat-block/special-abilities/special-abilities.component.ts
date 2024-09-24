import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-special-abilities',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './special-abilities.component.html',
  styleUrl: './special-abilities.component.css',
})
export class SpecialAbilitiesComponent {
  @Input() abilities: Array<{ name: string; desc: string }> = [];
}
