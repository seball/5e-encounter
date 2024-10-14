import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { CharacterService } from '../../../services/character.service';
import { Character } from '../../../interfaces/character.interface';

@Component({
  selector: 'app-sortable-list',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './sortable-list.component.html',
  styleUrls: ['./sortable-list.component.scss'],
})
export class SortableListComponent {
  characters: Character[] = [];

  constructor(private readonly characterService: CharacterService) {
    this.characters = [...this.characterService.characters()];
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.characters, event.previousIndex, event.currentIndex);
    console.log(this.characters);
    // this.characterService.updateCharacterOrder(this.characters);
    // this.itemsChange.emit(newOrder);
  }
}
