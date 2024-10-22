import { Component } from '@angular/core';
import { MainViewService, ViewType } from '../../services/main-view.service';
import { BattleService } from '../../services/battle.service';

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

  constructor(
    private readonly mainViewService: MainViewService,
    private readonly battleService: BattleService
  ) {}
  switchView(view: ViewType): void {
    this.mainViewService.setCurrentView(view);
  }
  next() {
    this.battleService.activateNext();
  }
}
