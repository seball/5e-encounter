import {
  Component,
  computed,
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
import {
  ContextMenuComponent,
  MenuItem,
} from '../../shared/ui/context-menu/context-menu.component';
import { ContextMenuIconType } from '../../shared/ui/context-menu/context-menu-item/context-menu-item.component';
import { LegendaryActionsComponent } from './legendary-actions/legendary-actions.component';
import { CharacterFacade } from '../../facades/character.facade';

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
    ContextMenuComponent,
    LegendaryActionsComponent,
  ],
  templateUrl: './monster-stat-block.component.html',
  styleUrl: './monster-stat-block.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class MonsterStatBlockComponent {
  @ViewChild('statblockDiv', { static: true }) statblockDiv!: ElementRef;
  @ViewChild(ContextMenuComponent) contextMenu!: ContextMenuComponent;

  statblock = computed(() =>
    this.characterFacade.getActiveCharacterStatblock()
  );
  activeCharacterId = computed(() => this.characterFacade.activeCharacterId());
  editMode: boolean = false;

  contextMenuItems: MenuItem[] = [
    {
      action: () => {
        this.edit();
      },
      icon: ContextMenuIconType.Edit,
      title: 'Edit',
    },
    {
      action: () => {
        this.save();
      },
      icon: ContextMenuIconType.Save,
      title: 'Save',
    },
  ];

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

  constructor(private readonly characterFacade: CharacterFacade) {}
}
