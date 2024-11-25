import {
  Component,
  computed,
  effect,
  ElementRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { CreatureHeadingComponent } from './creature-heading/creature-heading.component';
import { TopStatsComponent } from './top-stats/top-stats.component';
import { AbilitiesComponent } from './abilities/abilities.component';
import { PropertiesComponent } from './properties/properties.component';
import { SpecialAbilitiesComponent } from './special-abilities/special-abilities.component';
import { ActionsComponent } from './actions/actions.component';
import { ContextMenuComponent } from '../../shared/ui/context-menu/context-menu.component';
import { LegendaryActionsComponent } from './legendary-actions/legendary-actions.component';
import { CharacterFacade } from '../../facades/character.facade';
import { ReactionsComponent } from './reactions/reactions.component';
import { FormsModule } from '@angular/forms';
import { DiceTokenComponent } from '../../shared/ui/dice-token/dice-token.component';
import { ViewManagerService } from '../../services/viewManager.service';

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
    LegendaryActionsComponent,
    ReactionsComponent,
    FormsModule,
    DiceTokenComponent,
  ],
  templateUrl: './monster-stat-block.component.html',
  styleUrl: './monster-stat-block.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class MonsterStatBlockComponent {
  @ViewChild('statblockDiv', { static: true }) statblockDiv!: ElementRef;
  @ViewChild(ContextMenuComponent) contextMenu!: ContextMenuComponent;
  monsterDescription: string = '';
  isLoading = computed(() => this.viewManagerService.isLoading());

  constructor(
    private readonly characterFacade: CharacterFacade,
    private readonly viewManagerService: ViewManagerService
  ) {
    effect(() => {
      const editingId = this.characterFacade.editingCharacterId();
      this.editMode = !!editingId;
    });
  }
  statblock = computed(() =>
    this.characterFacade.getActiveCharacterStatblock()
  );
  activeCharacterId = computed(() => this.characterFacade.activeCharacterId());
  editMode: boolean = false;

  edit(): void {
    this.editMode = true;
  }
  save(): void {
    this.editMode = false;
    this.characterFacade.updateCharacterByStatblockId(this.statblock()!.id);
  }

  addStatblock() {
    this.characterFacade.createDefaultStatblock();
  }

  async generateStatblock(): Promise<void> {
    await this.characterFacade.generateStatblock(this.monsterDescription);
    this.monsterDescription = '';
  }
}
