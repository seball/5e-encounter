import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NumberToStringPipe } from '../../shared/pipes/number-to-string.pipe';
import { Character } from '../../interfaces/character.interface';
import {
  ContextMenuComponent,
  MenuItem,
} from '../../shared/ui/context-menu/context-menu.component';
import { ContextMenuIconType } from '../../shared/ui/context-menu/context-menu-item/context-menu-item.component';
import {
  Component,
  computed,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Signal,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { CharacterService } from '../../services/character.service';
import { EditableInputComponent } from '../../shared/ui/editable-input/editable-input.component';
import { D20Component } from './d20/d20.component';
import { MainViewService, ViewType } from '../../services/main-view.service';

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
  @ViewChild(ContextMenuComponent) contextMenu!: ContextMenuComponent;
  @ViewChild('characterCard', { static: true }) characterCard!: ElementRef;
  @Output() delete = new EventEmitter<string>();

  numberToString = new NumberToStringPipe();
  editMode: boolean = false;
  hpAdjustment: number = 0;
  avatarSrc: string = '';
  isInitiativeRollView: Signal<boolean>;
  currentView: Signal<ViewType>;
  constructor(
    private readonly characterService: CharacterService,
    private readonly mainViewService: MainViewService
  ) {
    this.currentView = this.mainViewService.getCurrentView();
    this.isInitiativeRollView = computed(
      () => this.currentView() === ViewType.InitiativeRoll
    );
  }

  onHasRolledInitiativeChange(hasRolled: boolean) {
    this.character.hasRolledInitiative = hasRolled;
  }

  onInitiativeRollChange(initiative: number) {
    this.character.initiativeRoll = initiative;
  }

  onInitiativeModChange(initiativeMod: number) {
    this.character.initiativeModifier = initiativeMod;
  }

  onInitiativeScoreChange(initiativeScore: number) {
    this.character.initiativeScore = initiativeScore;
  }

  get initiativeScore(): number | null {
    return this.character.initiativeScore;
  }

  get name(): string {
    if (this.character.statblock !== undefined) {
      return this.character.statblock.name;
    }
    return this.character.name;
  }

  set name(value: string) {
    if (this.character.statblock) {
      this.character.statblock.name = value;
    } else {
      this.character.name = value;
    }
  }

  get armorClass(): number {
    if (this.character.statblock !== undefined) {
      return this.character.statblock.armor_class[0].value;
    }
    return this.character.armorClass;
  }
  set armorClass(value: number) {
    if (this.character.statblock) {
      this.character.statblock.armor_class[0].value = value;
    } else {
      this.character.armorClass = value;
    }
  }

  ngOnInit() {
    if (!this.character) {
      console.error('Character input is required for CharacterComponent');
    }
    this.avatarSrc = this.character.avatarSrc;
  }
  onImageError() {
    this.avatarSrc = `https://api.dicebear.com/9.x/lorelei/svg?seed=${this.character.id}`;
  }
  heal(): void {
    this.character.currentHp = Math.min(
      this.character.currentHp + this.hpAdjustment,
      this.character.maxHp
    );
    this.hpAdjustment = 0;
  }

  damage(): void {
    this.character.currentHp = Math.max(
      this.character.currentHp - this.hpAdjustment,
      0
    );
    this.hpAdjustment = 0;
  }

  save(): void {
    this.editMode = false;
    this.characterService.updateCharacter(this.character);
  }

  edit(): void {
    this.editMode = true;
  }

  deleteCharacter(): void {
    this.delete.emit(this.character.id);
  }

  viewCharacter(): void {
    this.characterService.activateCharacter(this.character.id);
  }

  contextMenuItems: MenuItem[] = [
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
}
