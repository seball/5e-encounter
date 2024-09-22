import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Dnd5eApiService } from '../../services/dnd5eapi.service';
import { Monster } from '../../interfaces/monster.interface';
import { CommonModule } from '@angular/common';
import { CreatureHeadingComponent } from './creature-heading/creature-heading.component';
import { TopStatsComponent } from "./top-stats/top-stats.component";
import { AbilitiesComponent } from "./abilities/abilities.component";
import { PropertiesComponent } from "./properties/properties.component";
import { SpecialAbilitiesComponent } from "./special-abilities/special-abilities.component";
import { ActionsComponent } from "./actions/actions.component";


@Component({
  selector: 'app-monster-stat-block',
  standalone: true,
  imports: [CommonModule, CreatureHeadingComponent, TopStatsComponent, AbilitiesComponent, PropertiesComponent, SpecialAbilitiesComponent, ActionsComponent],
  templateUrl: './monster-stat-block.component.html',
  styleUrl: './monster-stat-block.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class MonsterStatBlockComponent implements OnInit {
  monster!: Monster;

  constructor(private monsterService: Dnd5eApiService) {}

  ngOnInit() {
    this.monsterService.getMonster('animated-armor').subscribe(
      (data: Monster) => {
        this.monster = data;
      },
      error => {
        console.error('Error fetching monster data:', error);
      }
    );
  }

}