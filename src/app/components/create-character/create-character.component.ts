import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CharacterService } from '../../services/character.service';
import { CharacterComponent } from '../character/character.component';

@Component({
  selector: 'app-create-character',
  standalone: true,
  imports: [CommonModule, CharacterComponent],
  templateUrl: './create-character.component.html',
  styleUrls: ['./create-character.component.css'],
})
export class CreateCharacterComponent {
  @Input() characterType: 'ally' | 'enemy' = 'ally';

  constructor(private characterService: CharacterService) {}

  public addCharacter(): void {
    this.characterService.addCharacter(this.characterType);
  }
}
