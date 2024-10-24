import { Injectable, signal, Signal } from '@angular/core';

export enum ViewType {
  InitiativeRoll = 'initiativeRoll',
  Manual = 'manual',
  StatBlock = 'statBlock',
}

export enum ViewMode {
  Default = 'default',
  Battle = 'battle',
}

@Injectable({
  providedIn: 'root',
})
export class ViewManagerService {
  private currentViewSignal = signal<ViewType>(ViewType.Manual);
  private currentModeSignal = signal<ViewMode>(ViewMode.Default);
  private previousViewSignal = signal<ViewType>(ViewType.Manual);

  constructor() {}

  getCurrentView(): Signal<ViewType> {
    return this.currentViewSignal.asReadonly();
  }

  getCurrentMode(): Signal<ViewMode> {
    return this.currentModeSignal.asReadonly();
  }

  getPreviousView(): Signal<ViewType> {
    return this.previousViewSignal.asReadonly();
  }

  setCurrentView(view: ViewType): void {
    this.previousViewSignal.set(this.currentViewSignal());
    this.currentViewSignal.set(view);
  }

  setMode(mode: ViewMode): void {
    this.currentModeSignal.set(mode);
  }

  enterBattleMode(): void {
    this.setMode(ViewMode.Battle);
  }

  exitBattleMode(): void {
    this.setMode(ViewMode.Default);
  }

  isInBattleMode(): boolean {
    return this.currentModeSignal() === ViewMode.Battle;
  }

  isCurrentView(view: ViewType): boolean {
    return this.currentViewSignal() === view;
  }

  getViewState(): { view: ViewType; mode: ViewMode } {
    return {
      view: this.currentViewSignal(),
      mode: this.currentModeSignal(),
    };
  }
}
