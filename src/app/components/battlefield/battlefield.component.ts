import { Component, ChangeDetectionStrategy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CharacterComponent } from '../character/character.component';
import { CreateCharacterComponent } from '../create-character/create-character.component';
import { MonsterStatBlockComponent } from '../monster-stat-block/monster-stat-block.component';
import { D20Component } from '../character/d20/d20.component';
import { MainViewComponent } from '../main-view/main-view.component';
import {
  ViewManagerService,
  ViewType,
} from '../../services/viewManager.service';
import { CharacterFacade } from '../../facades/character.facade';

@Component({
  selector: 'app-battlefield',
  standalone: true,
  imports: [
    CommonModule,
    CharacterComponent,
    CreateCharacterComponent,
    MonsterStatBlockComponent,
    D20Component,
    MainViewComponent,
  ],
  templateUrl: './battlefield.component.html',
  styleUrls: ['./battlefield.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BattlefieldComponent {
  protected readonly characters = {
    allies: computed(() => this.characterFacade.allies()),
    enemies: computed(() => this.characterFacade.enemies()),
  };

  protected readonly currentView = computed(() =>
    this.viewManagerService.getCurrentView()
  );

  protected readonly columnSizes = computed(() => ({
    side: this.currentView()() === ViewType.InitiativeRoll ? 'col-5' : 'col-3',
    center:
      this.currentView()() === ViewType.InitiativeRoll ? 'col-2' : 'col-6',
  }));

  constructor(
    private readonly characterFacade: CharacterFacade,
    private readonly viewManagerService: ViewManagerService
  ) {}
}
