import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NumberToStringPipe } from '../../shared/pipes/number-to-string.pipe';
import { Character } from '../../interfaces/character.interface';
import {
  ContextMenuComponent,
  MenuItem,
} from '../../shared/ui/context-menu/context-menu.component';
import { ContextMenuIconType } from '../../shared/ui/context-menu/context-menu-item/context-menu-item.component';

@Component({
  selector: 'app-character',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NumberToStringPipe,
    ContextMenuComponent,
  ],
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.scss'],
})
export class CharacterComponent {
  @Input() character!: Character;
  @ViewChild(ContextMenuComponent) contextMenu!: ContextMenuComponent;
  @ViewChild('targetDiv', { static: true }) targetDiv!: ElementRef;
  @Output() delete = new EventEmitter<string>();

  editMode: boolean = false;
  hpAdjustment: number = 0;

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
  }

  edit(): void {
    this.editMode = true;
  }

  contextMenuItems: MenuItem[] = [
    {
      action: () => {
        alert('view');
      },
      icon: ContextMenuIconType.View,
      title: 'View',
    },
    {
      action: () => this.edit(),
      icon: ContextMenuIconType.Edit,
      title: 'Edit',
    },
    {
      action: () => {
        alert('delete');
      },
      icon: ContextMenuIconType.Delete,
      title: 'Delete',
    },
  ];
  handleEnterKey(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.save();
    }
  }
}
