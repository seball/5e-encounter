import { Component, EventEmitter, Output } from '@angular/core';
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
export class MonsterSearchComponent {
  @Output() monsterSelected = new EventEmitter<ApiResult>();

  constructor(private readonly dnd5eApiService: Dnd5eApiService) {}

  get monsterEntries() {
    return this.dnd5eApiService.monsterEntries();
  }

  onSelect(monster: ApiResult) {
    if (monster) {
      this.monsterSelected.emit(monster);
    }
  }
}
