import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CharacterService } from '../../services/character.service'; 
import { Character } from '../../interfaces/character.interface';
import { CharacterComponent } from "../character/character.component";
import { Observable } from 'rxjs';

@Component({
  selector: 'app-create-character',
  standalone: true,
  imports: [CommonModule, CharacterComponent],
  templateUrl: './create-character.component.html',
  styleUrls: ['./create-character.component.css']
})
export class CreateCharacterComponent  {
  @Input() characterType: 'ally' | 'enemy' = 'ally';

  constructor(private characterService: CharacterService) {}

  addCharacter() {
    this.characterService.addCharacter(this.characterType);
  }
  
}