import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CharacterService } from '../../services/character.service';
import { Dnd5eApiService } from '../../services/dnd5eapi.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MonsterEntry } from '../../interfaces/monster.interface';

@Component({
  selector: 'app-create-enemy',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule, 
    NgSelectModule, 
    //NgOptionHighlightModule, 
    ReactiveFormsModule, 
  ],
  templateUrl: './create-enemy.component.html',
  styleUrl: './create-enemy.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateEnemyComponent implements OnInit {
  
  monsterEntries: MonsterEntry[] = [];
  
  constructor(private readonly characterService: CharacterService, private readonly dnd5eApiService: Dnd5eApiService) {}
  
  ngOnInit(): void {
    this.dnd5eApiService.getMonsterEntries().subscribe(m => this.monsterEntries = m)
  }

  

 }
