import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CharacterService } from '../../services/character.service';
import { Character } from '../../interfaces/character.interface';
import { CharacterComponent } from '../character/character.component';
import { CreateCharacterComponent } from '../create-character/create-character.component';
import { MonsterStatBlockComponent } from '../monster-stat-block/monster-stat-block.component';
import { listAnimation } from './list-animation';

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
  animations: [listAnimation],
})
export class BattlefieldComponent {
  allies = computed(() =>
    this.characterService.characters().filter(c => c.type === 'ally')
  );
  enemies = computed(() =>
    this.characterService.characters().filter(c => c.type === 'enemy')
  );

  animationTrigger = signal(0);

  constructor(public characterService: CharacterService) {}

  onCharacterDelete(id: string) {
    this.characterService.deleteCharacter(id);
    this.triggerAnimation();
  }

  sortCharacters() {
    this.characterService.sortCharactersByInitiative();
    this.triggerAnimation();
  }

  trackByFn(index: number, character: Character) {
    return character.id;
  }

  triggerAnimation() {
    this.animationTrigger.update(v => v + 1);
  }
}
