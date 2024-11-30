import { computed, Injectable, signal, Signal } from '@angular/core';
import { CharacterService } from './character.service';
import { BattleService } from './battle.service';

import { GeminiService } from './gemini.service';
import { StorageFacade } from '../facades/storage.facade';

export enum ViewType {
  InitiativeRoll = 'initiativeRoll',
  Manual = 'manual',
  StatBlock = 'statBlock',
  Initiative = 'Initiative',
  Settings = 'Settings',
}

export enum ViewState {
  Edit = 'EDIT',
  Battle = 'BATTLE',
  View = 'VIEW',
  Initiative = 'INITIATIVE',
  Loading = 'LOADING',
}

@Injectable({
  providedIn: 'root',
})
export class ViewManagerService {
  private readonly currentViewSignal;
  private readonly previousViewSignal;

  private readonly isEditingCharacter;
  readonly isBattleMode;
  readonly appState;
  readonly isLoading = computed(() => this.geminiService.isLoading());
  readonly currentView: Signal<ViewType>;
  readonly previousView: Signal<ViewType>;

  constructor(
    private readonly characterService: CharacterService,
    private readonly battleService: BattleService,
    private readonly storageFacade: StorageFacade,
    private readonly geminiService: GeminiService
  ) {
    this.currentViewSignal = signal<ViewType>(this.loadInitialView());
    this.previousViewSignal = signal<ViewType>(ViewType.Manual);

    this.isEditingCharacter = computed(
      () => this.characterService.editingCharacterId() !== null
    );
    this.isBattleMode = computed(() => this.battleService.isBattleMode());

    this.appState = computed(() => this.determineAppState());
    this.currentView = this.currentViewSignal.asReadonly();
    this.previousView = this.previousViewSignal.asReadonly();
  }

  setCurrentView(view: ViewType): void {
    this.previousViewSignal.set(this.currentViewSignal());
    this.currentViewSignal.set(view);
    this.storageFacade.setView(view);
  }

  isCurrentView(view: ViewType): boolean {
    return this.currentViewSignal() === view;
  }

  isCurrentState(state: ViewState): boolean {
    return this.appState() === state;
  }

  isBattleState(): Signal<boolean> {
    return this.battleService.isBattleMode;
  }

  private loadInitialView(): ViewType {
    try {
      return this.storageFacade.getView() ?? ViewType.Manual;
    } catch {
      return ViewType.Manual;
    }
  }

  private determineAppState(): ViewState {
    if (this.isLoading()) {
      return ViewState.Loading;
    }

    if (this.isEditingCharacter()) {
      return ViewState.Edit;
    }

    if (this.currentViewSignal() === ViewType.InitiativeRoll) {
      return ViewState.Initiative;
    }

    if (this.isBattleMode()) {
      return ViewState.Battle;
    }

    return ViewState.View;
  }
}
