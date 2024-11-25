import { Component, HostBinding, Input } from '@angular/core';
import { DICE_PATHS, DiceConfig } from '../../../config/dice-paths';
import { CommonModule } from '@angular/common';

type DiceType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20';

@Component({
  selector: 'app-dice-token',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dice-token.component.html',
  styleUrl: './dice-token.component.scss',
})
export class DiceTokenComponent {
  @HostBinding('style.--dice-size')
  get sizeVar(): string {
    return this.size;
  }

  @Input() type: DiceType = 'd4';
  @Input() color: string = '#1AA048';
  @Input() value: string | number = '';
  @Input() size: string = '64px';

  get diceConfig(): DiceConfig {
    return DICE_PATHS[this.type];
  }

  getFaceFilter(brightnessFactor: number = 1): string {
    if (brightnessFactor === 1) return 'none';
    return `brightness(${brightnessFactor})`;
  }
}
