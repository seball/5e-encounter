import { Component } from '@angular/core';
import { DiceTokenComponent } from '../../shared/ui/dice-token/dice-token.component';

@Component({
  selector: 'app-manual',
  standalone: true,
  imports: [DiceTokenComponent],
  templateUrl: './manual.component.html',
  styleUrl: './manual.component.css',
})
export class ManualComponent {}
