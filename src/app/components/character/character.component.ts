import {
  Component,
  computed,
  effect,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Character } from '../../interfaces/character.interface';
import { NumberToStringPipe } from '../../shared/pipes/number-to-string.pipe';
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

@Component({
  selector: 'app-character',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NumberToStringPipe,
    ContextMenuComponent,
    EditableInputComponent,
    D20Component,
  ],
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CharacterComponent implements OnInit {
  @Input() character!: Character;
  @Output() delete = new EventEmitter<string>();
  @ViewChild(ContextMenuComponent) contextMenu!: ContextMenuComponent;
  @ViewChild('characterCard', { static: true }) characterCard!: ElementRef;
  @HostBinding('style.order') characterOrder: number | null = null;

  protected readonly state = {
    editMode: false,
    hpAdjustment: 0,
    avatarSrc: '',
  };

  protected readonly viewState: {
    currentView: ReturnType<ViewManagerService['getCurrentView']>;
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
      action: () => this.edit(),
      icon: ContextMenuIconType.Edit,
      title: 'Edit',
    },
    {
      action: () => this.save(),
      icon: ContextMenuIconType.Save,
      title: 'Save',
    },
    {
      action: () => this.deleteCharacter(),
      icon: ContextMenuIconType.Delete,
      title: 'Delete',
    },
  ];

  constructor(
    private readonly characterFacade: CharacterFacade,
    private readonly viewManagerService: ViewManagerService,
    private readonly battleFacade: BattleFacade
  ) {
    this.viewState = {
      currentView: this.viewManagerService.getCurrentView(),
      isInitiativeRollView: computed(
        () =>
          this.viewManagerService.getCurrentView()() === ViewType.InitiativeRoll
      ),
      columnSizes: computed(() => ({
        left:
          this.viewManagerService.getCurrentView()() === ViewType.InitiativeRoll
            ? 'col-4'
            : 'col-8',
        right:
          this.viewManagerService.getCurrentView()() === ViewType.InitiativeRoll
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

    effect(() => this.updateCharacterOrder());
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

  protected save(): void {
    this.state.editMode = false;
    this.characterFacade.updateCharacter(this.character);
  }

  protected edit(): void {
    this.state.editMode = true;
  }

  protected deleteCharacter(): void {
    this.delete.emit(this.character.id);
  }

  protected viewCharacter(): void {
    this.characterFacade.activateCharacter(this.character.id);
  }

  protected onImageError(): void {
    this.state.avatarSrc = `https://api.dicebear.com/9.x/lorelei/svg?seed=${this.character.id}`;
  }

  private updateCharacterOrder(): void {
    const orderList = this.battleFacade.characterOrderList();
    const currentCharacter = orderList.find(
      char => char.id === this.character.id
    );

    if (!currentCharacter) return;

    if (this.battleFacade.isFirstTurn()) {
      this.setCharacterOrder(currentCharacter.order);
    } else {
      this.delayedOrderUpdate(currentCharacter.order);
    }
  }

  private setCharacterOrder(order: number): void {
    this.characterOrder = order;
  }

  private delayedOrderUpdate(order: number): void {
    setTimeout(() => {
      this.setCharacterOrder(order);
      if (this.characterCard) {
        this.characterCard.nativeElement.click();
      }
    }, 1000);
  }
}
