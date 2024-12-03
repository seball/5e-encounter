import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { XIcon } from 'lucide-angular';
import { InfoIcon, LucideAngularModule } from 'lucide-angular/src/icons';
import { TipsStorageService } from '../../../services/storage/tips-storage.services';

@Component({
  selector: 'app-tip-actions',
  standalone: true,
  imports: [LucideAngularModule, CommonModule],
  templateUrl: './tip-actions.component.html',
  styleUrl: './tip-actions.component.scss',
})
export class TipActionsComponent {
  readonly tipIcon = InfoIcon;
  readonly closeIcon = XIcon;
  isVisible = true;

  constructor(private readonly tipsStorage: TipsStorageService) {}

  ngOnInit() {
    this.isVisible = !this.tipsStorage.isDismissed('context-menu');
  }
  dismiss() {
    this.isVisible = false;
    this.tipsStorage.setDismissed('context-menu', true);
  }
}
