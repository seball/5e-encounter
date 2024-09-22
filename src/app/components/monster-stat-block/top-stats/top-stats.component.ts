import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-top-stats',
  standalone: true,
  imports: [],
  templateUrl: './top-stats.component.html',
  styleUrl: './top-stats.component.css'
})
export class TopStatsComponent {
  @Input() armorClass: number = 0;
  @Input() armorType: string = '';
  @Input() hitPoints: number = 0;
  @Input() hitDice: string = '';
  @Input() speed: string = '';
}
