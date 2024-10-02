import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ApiResult, Dnd5eApiService } from '../../services/dnd5eapi.service';

import { NgSelectComponent } from '@ng-select/ng-select';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-monster-search',
  standalone: true,
  templateUrl: './monster-search.component.html',
  styleUrls: ['./monster-search.component.scss'],
  imports: [NgSelectComponent, CommonModule],
})
export class MonsterSearchComponent implements OnInit {
  monsterEntries: ApiResult[] = [];
  @Output() monsterSelected = new EventEmitter<ApiResult>();

  constructor(private readonly dnd5eApiService: Dnd5eApiService) {}

  ngOnInit() {
    this.dnd5eApiService
      .getMonsterEntries()
      .subscribe(m => (this.monsterEntries = m));
  }

  onSelect(monster: ApiResult) {
    if (monster) {
      this.monsterSelected.emit(monster);
    }
  }
}
