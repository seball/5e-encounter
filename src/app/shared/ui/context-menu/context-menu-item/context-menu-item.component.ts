import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  LucideAngularModule,
  CircleXIcon,
  PencilIcon,
  TerminalIcon,
  ViewIcon,
  SaveIcon,
  ImageIcon,
  CopyIcon,
  ArrowLeftRightIcon,
} from 'lucide-angular';
import { UserRoundPlusIcon } from 'lucide-angular/src/icons';

export enum ContextMenuIconType {
  Delete = 'delete',
  View = 'view',
  Edit = 'edit',
  Default = 'default',
  Save = 'save',
  Image = 'image',
  Duplicate = 'duplicate',
  Switch = 'switch',
  Add = 'add',
}

@Component({
  selector: 'app-context-menu-item',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './context-menu-item.component.html',
  styleUrls: ['./context-menu-item.component.scss'],
})
export class ContextMenuItemComponent {
  private static readonly ICONS_MAP = {
    [ContextMenuIconType.Delete]: CircleXIcon,
    [ContextMenuIconType.View]: ViewIcon,
    [ContextMenuIconType.Edit]: PencilIcon,
    [ContextMenuIconType.Default]: TerminalIcon,
    [ContextMenuIconType.Save]: SaveIcon,
    [ContextMenuIconType.Image]: ImageIcon,
    [ContextMenuIconType.Duplicate]: CopyIcon,
    [ContextMenuIconType.Switch]: ArrowLeftRightIcon,
    [ContextMenuIconType.Add]: UserRoundPlusIcon,
  };

  @Input() icon: ContextMenuIconType = ContextMenuIconType.Default;
  @Output() action = new EventEmitter<void>();

  get selectedIcon() {
    return ContextMenuItemComponent.ICONS_MAP[this.icon];
  }

  onClick() {
    this.action.emit();
  }
}
