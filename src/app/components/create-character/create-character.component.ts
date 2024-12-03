import { Component, Input } from '@angular/core';

import { ApiResult } from '../../services/dnd5eapi.service';
import { CharacterFacade } from '../../facades/character.facade';
import { MonsterSearchComponent } from '../monster-search/monster-search.component';

@Component({
  selector: 'app-create-character',
  standalone: true,
  templateUrl: './create-character.component.html',
  styleUrls: ['./create-character.component.scss'],
  imports: [MonsterSearchComponent],
})
export class CreateCharacterComponent {
  @Input() characterType: 'ally' | 'enemy' = 'ally';

  constructor(private readonly characterFacade: CharacterFacade) {}

  public addDefaultCharacter(): void {
    this.characterFacade.addDefaultCharacter(this.characterType);
  }

  public onMonsterSelected(monster: ApiResult): void {
    if (monster.source === 'local')
      if (monster.statblock)
        this.characterFacade.addLocalStorageCharacter(
          this.characterType,
          monster.statblock
        );
    if (monster.source === 'api')
      this.characterFacade.addApiCharacter(this.characterType, monster.index);
  }
}
