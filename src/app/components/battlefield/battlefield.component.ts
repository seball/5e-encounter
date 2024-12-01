import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CharacterComponent } from '../character/character.component';
import { CreateCharacterComponent } from '../create-character/create-character.component';
import { MainViewComponent } from '../main-view/main-view.component';
import {
  ViewManagerService,
  ViewType,
} from '../../services/viewManager.service';
import { CharacterFacade } from '../../facades/character.facade';
import { computed, type Signal } from '@angular/core';
import { Character } from '../../interfaces/character.interface';

interface ColumnSizes {
  side: string;
  center: string;
}

@Component({
  selector: 'app-battlefield',
  standalone: true,
  imports: [
    CommonModule,
    CharacterComponent,
    CreateCharacterComponent,
    MainViewComponent,
  ],
  templateUrl: './battlefield.component.html',
  styleUrls: ['./battlefield.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BattlefieldComponent {
  protected readonly allies: Signal<Character[]>;
  protected readonly enemies: Signal<Character[]>;
  protected readonly currentView: Signal<ViewType>;
  protected readonly columnSizes: Signal<ColumnSizes>;

  constructor(
    private readonly characterFacade: CharacterFacade,
    private readonly viewManagerService: ViewManagerService
  ) {
    this.allies = this.characterFacade.allies;
    this.enemies = this.characterFacade.enemies;
    this.currentView = this.viewManagerService.currentView;
    this.columnSizes = computed<ColumnSizes>(() =>
      this.calculateColumnSizes(this.currentView())
    );
  }

  isBattleMode(): boolean {
    return this.viewManagerService.isBattleMode();
  }

  private calculateColumnSizes(view: ViewType): ColumnSizes {
    const isInitiativeRoll = view === ViewType.InitiativeRoll;

    return {
      side: isInitiativeRoll ? 'col-5' : 'col-3',
      center: isInitiativeRoll ? 'col-2' : 'col-6',
    };
  }
}
