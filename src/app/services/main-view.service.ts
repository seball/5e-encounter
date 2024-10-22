import { Injectable, signal, Signal } from '@angular/core';

export enum ViewType {
  InitiativeRoll = 'initiativeRoll',
  Manual = 'manual',
  StatBlock = 'statBlock',
  Battle = 'battle',
}

@Injectable({
  providedIn: 'root',
})
export class MainViewService {
  private currentViewSignal = signal<ViewType>(ViewType.Manual);

  constructor() {}

  getCurrentView(): Signal<ViewType> {
    return this.currentViewSignal.asReadonly();
  }

  setCurrentView(view: ViewType): void {
    this.currentViewSignal.set(view);
  }
}
