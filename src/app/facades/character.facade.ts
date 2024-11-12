import { computed, Injectable, Signal } from '@angular/core';
import { CharacterService } from '../services/character.service';
import { Dnd5eApiService } from '../services/dnd5eapi.service';
import { ViewManagerService, ViewType } from '../services/viewManager.service';
import { Character } from '../interfaces/character.interface';
import { Statblock } from '../interfaces/statblock.interface';
@Injectable({
  providedIn: 'root',
})
export class CharacterFacade {
  readonly characters = computed(() => this.characterService.characters());

  readonly allies: Signal<Character[]>;
  readonly enemies: Signal<Character[]>;

  readonly activeCharacterId = computed(() =>
    this.characterService.activeCharacterId()
  );
  readonly initiativeChanged = computed(() =>
    this.characterService.initiativeChanged()
  );

  readonly editingCharacterId = computed(() =>
    this.characterService.editingCharacterId()
  );

  constructor(
    private readonly characterService: CharacterService,
    private readonly dnd5eApiService: Dnd5eApiService,
    private readonly viewManagerService: ViewManagerService
  ) {
    this.allies = this.characterService.getAllies;
    this.enemies = this.characterService.getEnemies;
  }

  addPredefinedCharacter(
    characterType: 'ally' | 'enemy',
    monsterIndex: string
  ): void {
    this.dnd5eApiService.getMonster(monsterIndex).subscribe({
      next: statblock => {
        const newCharacter = this.characterService.createCharacterFromStatblock(
          statblock,
          characterType
        );
        this.characterService.addCharacter(newCharacter);
        this.activateLastCreatedCharacter();
      },
      error: error => {
        console.error(
          `Error fetching monster data for ${monsterIndex}:`,
          error
        );
      },
    });
  }

  addDefaultCharacter(type: 'ally' | 'enemy'): void {
    this.characterService.addDefaultCharacter(type);
    this.activateLastCreatedCharacter();
    this.characterService.startEditingLastCreatedCharacter();
  }

  updateCharacter(character: Character): void {
    this.characterService.updateCharacter(character);
  }

  deleteCharacter(id: string): void {
    this.characterService.deleteCharacter(id);
  }

  notifyInitiativeChanged(): void {
    this.characterService.notifyInitiativeChanged();
  }

  activateCharacter(id: string): void {
    this.characterService.activateCharacter(id);
    this.viewManagerService.setCurrentView(ViewType.StatBlock);
  }

  activateLastCreatedCharacter(): void {
    this.characterService.activateLastCreatedCharacter();
    this.viewManagerService.setCurrentView(ViewType.StatBlock);
  }

  getActiveCharacterStatblock(): Statblock | undefined {
    return this.characterService.getActiveCharacterStatblock();
  }

  updateCharacterByStatblockId(statblockId: string): void {
    this.characterService.updateCharacterByStatblockId(statblockId);
  }

  createDefaultStatblock(): void {
    this.characterService.createDefaultStatblock();
  }

  updateCharacterImage(updatedCharacter: Character, avatarSrc: string): void {
    this.characterService.updateCharacterImage(updatedCharacter, avatarSrc);
  }

  startEditingCharacter(id: string): void {
    this.characterService.startEditingCharacter(id);
  }

  stopEditingCharacter(): void {
    this.characterService.stopEditingCharacter();
  }

  duplicateCharacter(id: string): void {
    this.characterService.duplicateCharacter(id);
  }

  switchSides(id: string): void {
    this.characterService.switchSides(id);
  }
}
