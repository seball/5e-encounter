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
import { GeminiService, Model } from '../../services/gemini.service';
import { NgSelectComponent } from '@ng-select/ng-select';
import { ExpandableTextboxComponent } from '../../shared/ui/expandable-textbox/expandable-textbox.component';

@Component({
  selector: 'app-monster-stat-block',
  standalone: true,
  imports: [
    NgSelectComponent,
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
    ExpandableTextboxComponent,
  ],
  templateUrl: './monster-stat-block.component.html',
  styleUrl: './monster-stat-block.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class MonsterStatBlockComponent {
  @ViewChild('statblockDiv', { static: true }) statblockDiv!: ElementRef;
  @ViewChild(ContextMenuComponent) contextMenu!: ContextMenuComponent;
  isLoading = computed(() => this.viewManagerService.isLoading());

  protected readonly models = computed(() => this.geminiService.models());
  protected readonly isLoadingModels = computed(() =>
    this.geminiService.isLoadingModels()
  );
  protected readonly modelsError = computed(() =>
    this.geminiService.modelsError()
  );

  constructor(
    private readonly characterFacade: CharacterFacade,
    private readonly viewManagerService: ViewManagerService,
    private readonly geminiService: GeminiService
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

  isBattleState(): boolean {
    return this.viewManagerService.isBattleMode();
  }

  async generateStatblock(description: string): Promise<void> {
    await this.characterFacade.generateStatblock(description);
    console.log(description);
  }

  onSelect(model: Model): void {
    this.geminiService.setModel(model.name);
  }
}
