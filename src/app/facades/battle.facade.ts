import { Injectable, type Signal } from '@angular/core';
import { BattleService, CharacterOrder } from '../services/battle.service';
import { CharacterService } from '../services/character.service';
import { ViewManagerService, ViewType } from '../services/viewManager.service';

@Injectable({
  providedIn: 'root',
})
export class BattleFacade {
  readonly activeCharacter: Signal<string | null>;
  readonly previousCharacter: Signal<string | null>;
  readonly nextCharacter: Signal<string | null>;
  readonly currentRound: Signal<number>;
  readonly characterOrderList: Signal<CharacterOrder[]>;
  readonly isFirstTurn: Signal<boolean>;

  constructor(
    private readonly battleService: BattleService,
    private readonly characterService: CharacterService,
    private readonly viewManagerService: ViewManagerService
  ) {
    this.activeCharacter = this.battleService.activeCharacter;
    this.previousCharacter = this.battleService.previousCharacter;
    this.nextCharacter = this.battleService.nextCharacter;
    this.currentRound = this.battleService.currentRound;
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

  initializeBattle(): void {
    try {
      this.viewManagerService.enterBattleMode();
      this.battleService.initializeCharacters();
      const firstCharacter = this.battleService.activeCharacter();
      if (firstCharacter) {
        this.characterService.activateCharacter(firstCharacter);
      }
    } catch (error) {
      console.error('Failed to initialize battle:', error);
      throw new Error('Battle initialization failed');
    }
  }

  nextTurn(): void {
    try {
      this.battleService.activateNext();
      const nextChar = this.battleService.activeCharacter();
      if (nextChar) {
        this.characterService.activateCharacter(nextChar);
        this.viewManagerService.setCurrentView(ViewType.StatBlock);
      }
    } catch (error) {
      console.error('Failed to proceed to next turn:', error);
      throw new Error('Failed to proceed to next turn');
    }
  }

  previousTurn(): void {
    try {
      this.battleService.activatePrevious();
      const previousChar = this.battleService.activeCharacter();
      if (previousChar) {
        this.characterService.activateCharacter(previousChar);
        this.viewManagerService.setCurrentView(ViewType.StatBlock);
      }
    } catch (error) {
      console.error('Failed to return to previous turn:', error);
      throw new Error('Failed to return to previous turn');
    }
  }

  exitBattle(): void {
    try {
      this.viewManagerService.exitBattleMode();
      this.battleService.reset();
    } catch (error) {
      console.error('Failed to exit battle:', error);
      throw new Error('Failed to exit battle');
    }
  }
}
