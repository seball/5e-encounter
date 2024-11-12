import { Component, computed } from '@angular/core';
import {
  LucideAngularModule,
  HelpCircleIcon,
  ArrowBigRightDash,
  ArrowBigLeftDash,
  BanIcon,
  DicesIcon,
  DoorOpenIcon,
  PlayIcon,
  SaveIcon,
} from 'lucide-angular/src/icons';

import { CommonModule } from '@angular/common';

import { ToolbarFacade } from '../../facades/toolbar.facade';
import {
  ViewManagerService,
  ViewState,
} from '../../services/viewManager.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [LucideAngularModule, CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  protected helpIcon = HelpCircleIcon;
  protected leftIcon = ArrowBigLeftDash;
  protected rightIcon = ArrowBigRightDash;
  protected exitIcon = DoorOpenIcon;
  protected saveIcon = SaveIcon;
  protected discardIcon = BanIcon;
  protected startIcon = PlayIcon;
  protected rollIcon = DicesIcon;
  protected state = ViewState;
  protected viewState = computed(() => this.viewManagerService.appState());
  constructor(
    private readonly toolbarFacade: ToolbarFacade,
    private readonly viewManagerService: ViewManagerService
  ) {}

  nextTurn() {
    this.toolbarFacade.nextTurn();
  }

  startBattle() {
    this.toolbarFacade.initializeBattle();
  }

  previousTurn() {
    this.toolbarFacade.previousTurn();
  }
  exitBattle() {
    this.toolbarFacade.exitBattle();
  }

  saveCharacter() {
    this.toolbarFacade.updateActiveCharacter();
  }
  cancelCharacter() {
    this.toolbarFacade.discardCharacterChanges();
  }

  initiveView() {
    this.toolbarFacade.initiativeView();
  }

  manulaView() {
    this.toolbarFacade.manualView();
  }
}
