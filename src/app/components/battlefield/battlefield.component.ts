import { Component } from '@angular/core';
import { CreateCharacterComponent } from "../create-character/create-character.component";
import { Character } from '../../interfaces/character.interface';
import { CharacterService } from '../../services/character.service';
import { CommonModule } from '@angular/common';
import { CharacterComponent } from "../character/character.component";

@Component({
  selector: 'app-battlefield',
  standalone: true,
  imports: [CreateCharacterComponent, CommonModule, CharacterComponent],
  templateUrl: './battlefield.component.html',
  styleUrl: './battlefield.component.css'
})
export class BattleFieldComponent {
  allies: Character[] = [];
  enemies: Character[] = [];

  constructor(private characterService: CharacterService) {
    this.characterService.characters$.subscribe(characters => {
      this.allies = characters.filter(char => char.type === 'ally');
      this.enemies = characters.filter(char => char.type === 'enemy');
    });
  }
}
