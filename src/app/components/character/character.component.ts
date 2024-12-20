import {
  Component,
  computed,
  effect,
  ElementRef,
  HostBinding,
  Input,
  OnInit,
  signal,
  ViewChild,
  ViewEncapsulation,
  WritableSignal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Character } from '../../interfaces/character.interface';
import {
  ContextMenuComponent,
  MenuItem,
} from '../../shared/ui/context-menu/context-menu.component';
import { ContextMenuIconType } from '../../shared/ui/context-menu/context-menu-item/context-menu-item.component';
import { EditableInputComponent } from '../../shared/ui/editable-input/editable-input.component';
import { D20Component } from './d20/d20.component';
import {
  ViewManagerService,
  ViewType,
} from '../../services/viewManager.service';
import { BattleFacade } from '../../facades/battle.facade';
import { CharacterFacade } from '../../facades/character.facade';
import { ConfirmActionComponent } from '../../shared/ui/confirm-action/confirm-action.component';
import { AvatarGalleryComponent } from '../../shared/ui/avatar-gallery/avatar-gallery.component';
import { DiceTokenComponent } from '../../shared/ui/dice-token/dice-token.component';

@Component({
  selector: 'app-character',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ContextMenuComponent,
    EditableInputComponent,
    D20Component,
    ConfirmActionComponent,
    AvatarGalleryComponent,
    DiceTokenComponent,
  ],
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CharacterComponent implements OnInit {
  @Input() character!: Character;
  @ViewChild(ContextMenuComponent) contextMenu!: ContextMenuComponent;
  @ViewChild('content', { static: true }) content!: ElementRef;
  @HostBinding('style.order') characterOrder: number | null = null;

  protected showGallery = false;
  protected isViewing = computed(
    () => this.characterFacade.activeCharacterId() === this.character.id
  );
  protected tokenValue: WritableSignal<number | null> = signal(1);
  onAvatarSelected(avatarPath: string) {
    this.showGallery = false;
    this.state.avatarSrc = avatarPath;
    this.characterFacade.updateCharacterImage(this.character, avatarPath);
  }
  protected readonly state = {
    editMode: false,
    hpAdjustment: 0,
    showDeleteConfirmation: false,
    avatarSrc: '',
  };

  protected readonly viewState: {
    currentView: ReturnType<ViewManagerService['currentView']>;
    isInitiativeRollView: ReturnType<typeof computed<boolean>>;
    columnSizes: ReturnType<
      typeof computed<{
        left: string;
        right: string;
      }>
    >;
  };

  protected readonly battleState: {
    isActive: ReturnType<typeof computed<boolean>>;
    isPrevious: ReturnType<typeof computed<boolean>>;
    isNext: ReturnType<typeof computed<boolean>>;
    isExhausted: ReturnType<typeof computed<boolean>>;
  };

  protected readonly contextMenuItems: MenuItem[] = [
    {
      action: () => this.viewCharacter(),
      icon: ContextMenuIconType.View,
      title: 'View',
    },
    {
      action: () => this.editCharacter(),
      icon: ContextMenuIconType.Edit,
      title: 'Edit',
    },
    {
      action: () => this.saveCharacter(),
      icon: ContextMenuIconType.Save,
      title: 'Save',
    },
    {
      action: () => this.openGallery(),
      icon: ContextMenuIconType.Image,
      title: 'Change Image',
    },
    {
      action: () => this.duplicateCharacter(),
      icon: ContextMenuIconType.Duplicate,
      title: 'Duplicate',
    },
    {
      action: () => this.switchSides(),
      icon: ContextMenuIconType.Switch,
      title: 'Switch Sides',
    },
    {
      action: () => this.confirmDelete(),
      icon: ContextMenuIconType.Delete,
      title: 'Delete',
    },
    {
      action: () => this.addToCollection(),
      icon: ContextMenuIconType.Add,
      title: 'Add to Monster List',
    },
  ];

  constructor(
    private readonly characterFacade: CharacterFacade,
    private readonly viewManagerService: ViewManagerService,
    private readonly battleFacade: BattleFacade
  ) {
    this.viewState = {
      currentView: this.viewManagerService.currentView(),
      isInitiativeRollView: computed(
        () => this.viewManagerService.currentView() === ViewType.InitiativeRoll
      ),
      columnSizes: computed(() => ({
        left:
          this.viewManagerService.currentView() === ViewType.InitiativeRoll
            ? 'col-4'
            : 'col-8',
        right:
          this.viewManagerService.currentView() === ViewType.InitiativeRoll
            ? 'col-2'
            : 'col-4',
      })),
    };

    this.battleState = {
      isActive: computed(() =>
        this.battleFacade.isCharacterActive(this.character.id)
      ),
      isPrevious: computed(() =>
        this.battleFacade.isCharacterPrevious(this.character.id)
      ),
      isNext: computed(() =>
        this.battleFacade.isCharacterNext(this.character.id)
      ),
      isExhausted: computed(() =>
        this.battleFacade.isCharacterExhausted(this.character.id)
      ),
    };

    this.initializeCharacterOrderEffect();
    this.initializeEditingEffect();
  }

  ngOnInit(): void {
    if (!this.character) {
      console.error('Character input is required for CharacterComponent');
      return;
    }
    this.state.avatarSrc = this.character.avatarSrc;
  }

  get name(): string {
    return this.character.statblock?.name ?? this.character.name;
  }
  set name(value: string) {
    if (this.character.statblock) {
      this.character.statblock.name = value;
    } else {
      this.character.name = value;
    }
  }

  get armorClass(): number {
    return (
      this.character.statblock?.armor_class[0].value ??
      this.character.armorClass
    );
  }
  set armorClass(value: number) {
    if (this.character.statblock) {
      this.character.statblock.armor_class[0].value = value;
    } else {
      this.character.armorClass = value;
    }
  }

  get maxHp(): number {
    return this.character.statblock?.hit_points ?? this.character.maxHp;
  }
  set maxHp(value: number) {
    if (this.character.statblock) {
      this.character.statblock.hit_points = value;
    } else {
      this.character.maxHp = value;
    }
  }

  get initiativeScore(): number | null {
    return this.character.initiativeScore;
  }

  protected onInitiativeChange = {
    hasRolled: (hasRolled: boolean) => {
      this.character.hasRolledInitiative = hasRolled;
    },
    roll: (initiative: number) => {
      this.character.initiativeRoll = initiative;
    },
    mod: (initiativeMod: number) => {
      this.character.initiativeModifier = initiativeMod;
    },
    score: (initiativeScore: number) => {
      this.character.initiativeScore = initiativeScore;
    },
  };

  protected heal(): void {
    this.character.currentHp = Math.min(
      this.character.currentHp + this.state.hpAdjustment,
      this.maxHp
    );
    this.state.hpAdjustment = 0;
  }

  protected damage(): void {
    this.character.currentHp = Math.max(
      this.character.currentHp - this.state.hpAdjustment,
      0
    );
    this.state.hpAdjustment = 0;
  }
  protected isBattleMode(): boolean {
    return this.viewManagerService.isBattleMode();
  }

  protected isCharacterDead(): boolean {
    return this.character.currentHp <= 0;
  }

  protected saveCharacter(): void {
    this.characterFacade.stopEditingCharacter();
    this.characterFacade.updateCharacter(this.character);
  }

  protected addToCollection(): void {
    this.characterFacade.addToCollection(this.character);
  }

  protected editCharacter(): void {
    this.characterFacade.startEditingCharacter(this.character.id);
    this.characterFacade.activateCharacter(this.character.id);
  }

  protected deleteCharacter(): void {
    this.characterFacade.deleteCharacter(this.character.id);
  }

  protected viewCharacter(): void {
    this.characterFacade.stopEditingCharacter();
    this.characterFacade.activateCharacter(this.character.id);
  }

  protected duplicateCharacter(): void {
    this.characterFacade.duplicateCharacter(this.character.id);
  }

  protected switchSides(): void {
    this.characterFacade.switchSides(this.character.id);
  }

  protected onImageError(): void {
    this.state.avatarSrc = 'assets/monsters/default.webp';
  }

  private setCharacterOrder(order: number | null): void {
    this.characterOrder = order;
  }

  private delayedOrderUpdate(order: number | null): void {
    setTimeout(() => {
      if (!this.isBattleMode()) {
        order = null;
      }
      this.setCharacterOrder(order);
      if (this.content) {
        this.content.nativeElement.click();
      }
    }, 1000);
  }

  protected openGallery(): void {
    this.showGallery = true;
  }
  protected confirmDelete(): void {
    this.state.showDeleteConfirmation = true;
  }

  protected onDeleteConfirm(): void {
    this.deleteCharacter();
  }

  protected onDeleteCancel(): void {
    this.state.showDeleteConfirmation = false;
  }

  private initializeEditingEffect(): void {
    effect(() => {
      const editingId = this.characterFacade.editingCharacterId();
      this.state.editMode = editingId === this.character?.id;
    });
  }

  private initializeCharacterOrderEffect(): void {
    effect(
      () => {
        const orderList = this.battleFacade.characterOrderList();

        const currentCharacter = orderList.find(
          char => char.id === this.character.id
        );

        if (!currentCharacter) {
          this.characterOrder = null;
          return;
        }

        if (this.battleFacade.isFirstTurn()) {
          this.setCharacterOrder(currentCharacter.order);
          this.tokenValue.set(currentCharacter.order);
        } else {
          this.delayedOrderUpdate(currentCharacter.order);
        }
      },
      { allowSignalWrites: true }
    );
  }
}
