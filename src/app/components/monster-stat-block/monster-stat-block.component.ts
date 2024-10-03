import { Component, computed, OnInit, ViewEncapsulation } from '@angular/core';

import { CommonModule } from '@angular/common';
import { CreatureHeadingComponent } from './creature-heading/creature-heading.component';
import { TopStatsComponent } from './top-stats/top-stats.component';
import { AbilitiesComponent } from './abilities/abilities.component';
import { PropertiesComponent } from './properties/properties.component';
import { SpecialAbilitiesComponent } from './special-abilities/special-abilities.component';
import { ActionsComponent } from './actions/actions.component';
import { CharacterService } from '../../services/character.service';

@Component({
  selector: 'app-monster-stat-block',
  standalone: true,
  imports: [
    CommonModule,
    CreatureHeadingComponent,
    TopStatsComponent,
    AbilitiesComponent,
    PropertiesComponent,
    SpecialAbilitiesComponent,
    ActionsComponent,
  ],
  templateUrl: './monster-stat-block.component.html',
  styleUrl: './monster-stat-block.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class MonsterStatBlockComponent implements OnInit {
  statblock = computed(() =>
    this.characterService.getActiveCharacterStatblock()
  );

  constructor(private readonly characterService: CharacterService) {}

  ngOnInit() {}
}
