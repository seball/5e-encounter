import { Component, computed, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { LucideAngularModule } from 'lucide-angular';
import { GripVerticalIcon } from 'lucide-angular/src/icons';
import { Character } from '../../interfaces/character.interface';
import { BattleFacade } from '../../facades/battle.facade';
import { CharacterFacade } from '../../facades/character.facade';

interface OrderedCharacter {
  id: string;
  name: string;
  initiativeScore: number | null;
  hasRolledInitiative: boolean;
}

@Component({
  selector: 'app-roll-order',
  standalone: true,
  imports: [CommonModule, DragDropModule, LucideAngularModule],
  templateUrl: './roll-order.component.html',
  styleUrl: './roll-order.component.scss',
})
export class RollOrderComponent {
  protected readonly uiState = {
    gripIcon: GripVerticalIcon,
    title: 'ROLL ORDER',
    subtitle: 'adjust by drag and drop',
    confirmButtonText: 'CONFIRM ORDER',
  };

  protected readonly characters = computed(() =>
    this.characterFacade.characters().sort(this.compareCharacterInitiatives)
  );

  protected readonly orderedCharacters = signal<OrderedCharacter[]>([]);

  constructor(
    private readonly characterFacade: CharacterFacade,
    private readonly battleFacade: BattleFacade
  ) {
    effect(() => {
      this.characterFacade.initiativeChanged();
      this.characters().sort(this.compareCharacterInitiatives);
    });
  }

  protected onDrop(event: CdkDragDrop<string[]>): void {
    const characters = this.characters();
    moveItemInArray(characters, event.previousIndex, event.currentIndex);
    this.updateOrderedCharacters();
  }

  protected onSaveOrder(): void {
    const orderedCharacterIds = this.characters().map(char => char.id);
    this.battleFacade.initializeBattle(orderedCharacterIds);
  }

  protected getInitiativeDisplay(character: Character): string {
    return character.hasRolledInitiative
      ? (character.initiativeScore?.toString() ?? '--')
      : '--';
  }

  protected getCharacterName(character: Character): string {
    return character.statblock?.name ?? character.name;
  }

  private updateOrderedCharacters(): void {
    this.orderedCharacters.set(
      this.characters().map(char => ({
        id: char.id,
        name: this.getCharacterName(char),
        initiativeScore: char.initiativeScore,
        hasRolledInitiative: char.hasRolledInitiative,
      }))
    );
  }

  private compareCharacterInitiatives(a: Character, b: Character): number {
    if (a.initiativeScore === null && b.initiativeScore === null) return 0;
    if (a.initiativeScore === null) return 1;
    if (b.initiativeScore === null) return -1;
    return b.initiativeScore - a.initiativeScore;
  }
}
