import { computed, Injectable, signal, Signal } from '@angular/core';
import { CharacterService } from './character.service';
import { BattleService } from './battle.service';

export enum ViewType {
  InitiativeRoll = 'initiativeRoll',
  Manual = 'manual',
  StatBlock = 'statBlock',
  Initiative = 'Initiative',
}

export enum ViewState {
  Edit = 'EDIT',
  Battle = 'BATTLE',
  View = 'VIEW',
  Initiative = 'INITIATIVE',
}

const STORAGE_KEYS = {
  VIEW: 'currentView',
} as const;

@Injectable({
  providedIn: 'root',
})
export class ViewManagerService {
  private currentViewSignal = signal<ViewType>(this.loadStoredView());
  private previousViewSignal = signal<ViewType>(ViewType.Manual);
  private isEditingCharacter = computed(
    () => this.characterService.editingCharacterId() !== null
  );
  private isBattleMode = computed(() => this.battleService.isBattleMode());
  constructor(
    private readonly characterService: CharacterService,
    private readonly battleService: BattleService
  ) {}

  private loadStoredView(): ViewType {
    const storedView = localStorage.getItem(STORAGE_KEYS.VIEW);
    return (storedView as ViewType) || ViewType.Manual;
  }

  private saveToStorage(key: keyof typeof STORAGE_KEYS, value: string): void {
    localStorage.setItem(STORAGE_KEYS[key], value);
  }

  appState = computed(() => {
    if (this.isEditingCharacter()) {
      return ViewState.Edit;
    }
    if (this.getCurrentView()() === ViewType.InitiativeRoll) {
      return ViewState.Initiative;
    }
    if (this.isBattleMode()) {
      return ViewState.Battle;
    }
    return ViewState.View;
  });

  getCurrentView(): Signal<ViewType> {
    return this.currentViewSignal.asReadonly();
  }

  getPreviousView(): Signal<ViewType> {
    return this.previousViewSignal.asReadonly();
  }

  setCurrentView(view: ViewType): void {
    this.previousViewSignal.set(this.currentViewSignal());
    this.currentViewSignal.set(view);
    this.saveToStorage('VIEW', view);
  }

  isCurrentView(view: ViewType): boolean {
    return this.currentViewSignal() === view;
  }
}
