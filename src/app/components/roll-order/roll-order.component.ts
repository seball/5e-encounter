import { Component, computed, effect } from '@angular/core';
import { CharacterService } from '../../services/character.service';
import { Character } from '../../interfaces/character.interface';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-roll-order',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './roll-order.component.html',
  styleUrl: './roll-order.component.scss',
})
export class RollOrderComponent {
  characters = computed(() => this.characterService.characters());
  orderedCharacters: Character[] = [];

  constructor(private readonly characterService: CharacterService) {
    effect(() => {
      this.characterService.initiativeChanged();
      this.characters().sort(this.compareCharacterInitiatives);
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.characters(), event.previousIndex, event.currentIndex);
  }

  getCharacterName(character: Character): string {
    return character.statblock?.name || character.name;
  }
  private compareCharacterInitiatives(a: Character, b: Character): number {
    if (a.initiativeScore === null && b.initiativeScore === null) {
      return 0;
    }
    if (a.initiativeScore === null) {
      return 1;
    }
    if (b.initiativeScore === null) {
      return -1;
    }
    return b.initiativeScore - a.initiativeScore;
  }
}
