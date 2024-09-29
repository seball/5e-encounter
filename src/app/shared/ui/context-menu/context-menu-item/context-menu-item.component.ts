import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  LucideAngularModule,
  CircleXIcon,
  PencilIcon,
  TerminalIcon,
  ViewIcon,
} from 'lucide-angular';

export enum ContextMenuIconType {
  Delete = 'delete',
  View = 'view',
  Edit = 'edit',
  Default = 'default',
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
