import { Injectable } from '@angular/core';
import { ViewManagerService, ViewType } from '../services/viewManager.service';
import { CharacterService } from '../services/character.service';
import { BattleService } from '../services/battle.service';

@Injectable({
  providedIn: 'root',
})
export class ToolbarFacade {
  constructor(
    private readonly viewManagerService: ViewManagerService,
    private readonly characterService: CharacterService,
    private readonly battleService: BattleService
  ) {}

  exitBattle(): void {
    try {
      this.battleService.reset();
    } catch (error) {
      console.error('Failed to exit battle:', error);
      throw new Error('Failed to exit battle');
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

  initializeBattle(): void {
    try {
      this.viewManagerService.setCurrentView(ViewType.StatBlock);
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

  updateActiveCharacter(): void {
    this.characterService.updateActiveCharacter();
    this.characterService.stopEditingCharacter();
  }

  discardCharacterChanges(): void {
    this.characterService.revertEditingChanges();
    this.characterService.stopEditingCharacter();
  }

  initiativeView(): void {
    this.viewManagerService.setCurrentView(ViewType.InitiativeRoll);
  }

  manualView(): void {
    this.viewManagerService.setCurrentView(ViewType.Manual);
  }
}
