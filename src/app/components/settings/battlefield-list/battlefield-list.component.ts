import { Component, EventEmitter, Input, Output, Signal } from '@angular/core';

import { DownloadIcon, XIcon } from 'lucide-angular/src/icons';
import { LucideAngularModule } from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { Battlefield } from '../../../interfaces/battlefield.interface';

@Component({
  selector: 'app-battlefield-list',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './battlefield-list.component.html',
  styleUrl: './battlefield-list.component.scss',
})
export class BattlefieldListComponent {
  @Input({ required: true }) battlefields!: Signal<Battlefield[]>;
  @Output() loadRequested = new EventEmitter<Battlefield>();
  @Output() deleteRequested = new EventEmitter<Battlefield>();

  xIcon = XIcon;
  loadIcon = DownloadIcon;

  load(battlefield: Battlefield): void {
    this.loadRequested.emit(battlefield);
  }

  delete(battlefield: Battlefield): void {
    this.deleteRequested.emit(battlefield);
  }
}
