import { CommonModule } from '@angular/common';
import { Component, HostListener, Input, ElementRef } from '@angular/core';
import {
  ContextMenuIconType,
  ContextMenuItemComponent,
} from './context-menu-item/context-menu-item.component';

export interface MenuItem {
  action: () => void;
  icon: ContextMenuIconType;
  title: string;
}

@Component({
  selector: 'app-context-menu',
  standalone: true,
  imports: [CommonModule, ContextMenuItemComponent],
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss'],
})
export class ContextMenuComponent {
  @Input() targetElement!: ElementRef | HTMLElement;
  @Input() menuItems: MenuItem[] = [];

  isVisible = false;
  posX = 0;
  posY = 0;
  menuWidth = 0;
  menuHeight = 0;

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  hideContextMenu(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isVisible = false;
    }
  }

  @HostListener('document:contextmenu', ['$event'])
  onContextMenu(event: MouseEvent) {
    const target = this.getTargetElement();
    if (target && target.contains(event.target as Node)) {
      event.preventDefault();
      this.showContextMenu(event);
    }
  }

  onMenuItemClick(item: MenuItem) {
    item.action();
    this.isVisible = false;
  }

  private getTargetElement(): HTMLElement | null {
    if (this.targetElement instanceof ElementRef) {
      return this.targetElement.nativeElement;
    } else if (this.targetElement instanceof HTMLElement) {
      return this.targetElement;
    }
    return null;
  }

  private showContextMenu(event: MouseEvent) {
    const menu = this.elementRef.nativeElement.querySelector(
      '#context-menu'
    ) as HTMLElement;

    if (!menu) return;

    if (!this.menuWidth || !this.menuHeight) {
      menu.style.visibility = 'hidden';
      menu.style.display = 'block';
      this.menuWidth = menu.offsetWidth;
      this.menuHeight = menu.offsetHeight;
      menu.removeAttribute('style');
    }

    this.posX =
      this.menuWidth + event.pageX >= window.innerWidth
        ? event.pageX - this.menuWidth
        : event.pageX;

    this.posY =
      this.menuHeight + event.pageY >= window.innerHeight
        ? event.pageY - this.menuHeight
        : event.pageY;

    this.isVisible = true;
  }
}
