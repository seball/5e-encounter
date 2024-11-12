import { Injectable, Signal } from '@angular/core';
import { BattleService, CharacterOrder } from '../services/battle.service';

@Injectable({
  providedIn: 'root',
})
export class BattleFacade {
  readonly characterOrderList: Signal<CharacterOrder[]>;
  readonly isFirstTurn: Signal<boolean>;
  constructor(private readonly battleService: BattleService) {
    this.characterOrderList = this.battleService.characterOrderList;
    this.isFirstTurn = this.battleService.isFirstTurn;
  }

  isCharacterActive(id: string): boolean {
    return this.battleService.isCharacterActive(id);
  }

  isCharacterPrevious(id: string): boolean {
    return this.battleService.isCharacterPrevious(id);
  }

  isCharacterNext(id: string): boolean {
    return this.battleService.isCharacterNext(id);
  }

  isCharacterExhausted(id: string): boolean {
    return this.battleService.isCharacterExhausted(id);
  }

  updateOrderedCharacterIds(ids: string[]) {
    this.battleService.updateOrderedCharacterIds(ids);
  }
}
