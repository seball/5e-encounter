import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CharacterService } from '../../services/character.service';
import { CharacterComponent } from '../character/character.component';
import { MonsterSearchComponent } from '../monster-search/monster-search.component';
import { ApiResult } from '../../services/dnd5eapi.service';

@Component({
  selector: 'app-create-character',
  standalone: true,
  imports: [CommonModule, CharacterComponent, MonsterSearchComponent],
  templateUrl: './create-character.component.html',
  styleUrls: ['./create-character.component.css'],
})
export class CreateCharacterComponent {
  @Input() characterType: 'ally' | 'enemy' = 'ally';

  constructor(private readonly characterService: CharacterService) {}

  public addDefaultCharacter(): void {
    this.characterService.addDefaultCharacter(this.characterType);
  }

  public addPredefinedCharacter(monsterIndex: string): void {
    this.characterService.addPredefinedCharacter(
      this.characterType,
      monsterIndex
    );
  }

  public onMonsterSelected(monster: ApiResult): void {
    this.addPredefinedCharacter(monster.index);
  }
}
