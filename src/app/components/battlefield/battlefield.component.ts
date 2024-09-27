import { Component } from '@angular/core';
import { CreateCharacterComponent } from '../create-character/create-character.component';
import { Character } from '../../interfaces/character.interface';
import { CharacterService } from '../../services/character.service';
import { CommonModule } from '@angular/common';
import { CharacterComponent } from '../character/character.component';
import { MonsterStatBlockComponent } from '../monster-stat-block/monster-stat-block.component';

@Component({
  selector: 'app-battlefield',
  standalone: true,
  imports: [
    CreateCharacterComponent,
    CommonModule,
    CharacterComponent,
    MonsterStatBlockComponent,
    MonsterStatBlockComponent,
  ],
  templateUrl: './battlefield.component.html',
  styleUrl: './battlefield.component.scss',
})
export class BattleFieldComponent {
  public get allies(): Character[] {
    return this.characterService.characters().filter(char => char.type === 'ally');
  }

  public get enemies(): Character[] {
    return this.characterService.characters().filter(char => char.type === 'enemy');
  }

  constructor(private characterService: CharacterService) {}

  public onCharacterDelete(name: string) {
    if(confirm("Are you sure to delete " + name)){
      this.characterService.deleteCharacter(name);
    }
  }
}
