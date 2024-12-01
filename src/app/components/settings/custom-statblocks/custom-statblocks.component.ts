import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, Signal } from '@angular/core';
import { LucideAngularModule, XIcon } from 'lucide-angular/src/icons';
import { Statblock } from '../../../interfaces/statblock.interface';

@Component({
  selector: 'app-custom-statblocks',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './custom-statblocks.component.html',
  styleUrl: './custom-statblocks.component.scss',
})
export class CustomStatblocksComponent {
  @Input({ required: true }) statblocks!: Signal<Statblock[]>;
  @Output() deleteRequested = new EventEmitter<Statblock>();

  xIcon = XIcon;

  deleteStatblock(statblock: Statblock): void {
    this.deleteRequested.emit(statblock);
  }
}
