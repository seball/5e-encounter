import { Component, Input } from '@angular/core';
import { TaperedRuleComponent } from '../../../shared/ui/tapered-rule/tapered-rule.component';
import { Speed } from '../../../interfaces/statblock.interface';

@Component({
  selector: 'app-top-stats',
  standalone: true,
  imports: [TaperedRuleComponent],
  templateUrl: './top-stats.component.html',
  styleUrl: './top-stats.component.css',
})
export class TopStatsComponent {
  @Input() armorClass: number = 0;
  @Input() armorType: string = '';
  @Input() hitPoints: number = 0;
  @Input() hitDice: string = '';
  @Input() speed: Speed = {};

  getSpeedString(): string {
    const speedParts: string[] = [];
    const speed = this.speed;
    Object.keys(speed).forEach(key => {
      const value = (speed as any)[key];
      if (value) {
        if (key === 'fly' && speed.hover) {
          speedParts.push(`${key} ${value} (hover)`);
        } else {
          speedParts.push(`${key} ${value}`);
        }
      }
    });
    return speedParts.join(', ');
  }
}
