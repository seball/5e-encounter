import { Component, Signal } from '@angular/core';
import { MonsterStatBlockComponent } from '../monster-stat-block/monster-stat-block.component';
import { ManualComponent } from '../manual/manual.component';
import { CommonModule } from '@angular/common';
import { RollOrderComponent } from '../roll-order/roll-order.component';
import {
  ViewManagerService,
  ViewType,
} from '../../services/viewManager.service';

@Component({
  selector: 'app-main-view',
  standalone: true,
  imports: [
    MonsterStatBlockComponent,
    ManualComponent,
    CommonModule,
    RollOrderComponent,
  ],
  templateUrl: './main-view.component.html',
  styleUrl: './main-view.component.scss',
})
export class MainViewComponent {
  currentView: Signal<ViewType>;
  view = ViewType;

  constructor(private readonly viewManagerService: ViewManagerService) {
    this.currentView = this.viewManagerService.getCurrentView();
  }
}
