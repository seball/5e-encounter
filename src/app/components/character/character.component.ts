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
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { CharacterService } from '../../services/character.service';
import { EditableInputComponent } from '../../shared/ui/editable-input/editable-input.component';

@Component({
  selector: 'app-character',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NumberToStringPipe,
    ContextMenuComponent,
    EditableInputComponent,
  ],
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CharacterComponent {
  @Input() character!: Character;
  @ViewChild(ContextMenuComponent) contextMenu!: ContextMenuComponent;
  @ViewChild('characterCard', { static: true }) characterCard!: ElementRef;
  @Output() delete = new EventEmitter<string>();

  editMode: boolean = false;
  hpAdjustment: number = 0;
  constructor(private readonly characterService: CharacterService) {}

  get name(): string {
    return this.character.statblock?.name || this.character.name;
  }

  set name(value: string) {
    if (this.character.statblock) {
      this.character.statblock.name = value;
    } else {
      this.character.name = value;
    }
  }

  ngOnInit() {
    if (!this.character) {
      console.error('Character input is required for CharacterComponent');
    }
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
