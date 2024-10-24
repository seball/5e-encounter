import { Component, computed } from '@angular/core';
import { BattleService } from '../../services/battle.service';
import {
  LucideAngularModule,
  HelpCircleIcon,
  ArrowBigRightDash,
} from 'lucide-angular/src/icons';
import { ArrowBigLeftDash, DoorOpenIcon } from 'lucide-angular';
import { CommonModule } from '@angular/common';
import {
  ViewManagerService,
  ViewType,
} from '../../services/viewManager.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [LucideAngularModule, CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  rollView = ViewType.InitiativeRoll;
  manualView = ViewType.Manual;
  statBlockView = ViewType.StatBlock;
  protected helpIcon = HelpCircleIcon;
  protected leftIcon = ArrowBigLeftDash;
  protected rightIcon = ArrowBigRightDash;
  protected exitIcon = DoorOpenIcon;
  protected currentView = computed(() =>
    this.viewManagerService.getCurrentView()()
  );
  protected isBattleMode = computed(() =>
    this.viewManagerService.isInBattleMode()
  );
  constructor(
    private readonly viewManagerService: ViewManagerService,
    private readonly battleService: BattleService
  ) {}
  switchView(view: ViewType): void {
    this.viewManagerService.setCurrentView(view);
  }
  next() {
    this.battleService.activateNext();
  }

  previous() {
    this.battleService.activatePrevious();
  }
  exit() {
    this.battleService.exitBattle();
  }
}
