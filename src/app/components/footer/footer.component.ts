import { Component } from '@angular/core';
import { MainViewService, ViewType } from '../../services/main-view.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  rollView = ViewType.InitiativeRoll;
  manualView = ViewType.Manual;
  statBlockView = ViewType.StatBlock;
  constructor(private readonly mainViewService: MainViewService) {}
  switchView(view: ViewType): void {
    this.mainViewService.setCurrentView(view);
  }
}
