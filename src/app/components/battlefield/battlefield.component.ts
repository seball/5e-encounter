import { Component, ChangeDetectionStrategy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CharacterService } from '../../services/character.service';
import { CharacterComponent } from '../character/character.component';
import { CreateCharacterComponent } from '../create-character/create-character.component';
import { MonsterStatBlockComponent } from '../monster-stat-block/monster-stat-block.component';

@Component({
  selector: 'app-battlefield',
  standalone: true,
  imports: [
    CommonModule,
    CharacterComponent,
    CreateCharacterComponent,
    MonsterStatBlockComponent,
  ],
  templateUrl: './battlefield.component.html',
  styleUrls: ['./battlefield.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BattlefieldComponent {
  allies = computed(() => this.characterService.getEnemies());
  enemies = computed(() => this.characterService.getEnemies());

  constructor(public characterService: CharacterService) {}

  onCharacterDelete(id: string) {
    this.characterService.deleteCharacter(id);
  }

  sortCharacters() {
    this.characterService.sortCharactersByInitiative();
  }
}
