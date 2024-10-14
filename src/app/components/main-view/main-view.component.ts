import { Component, Signal } from '@angular/core';
import { SortableListComponent } from '../../shared/ui/sortable-list/sortable-list.component';
import { MonsterStatBlockComponent } from '../monster-stat-block/monster-stat-block.component';
import { ManualComponent } from '../manual/manual.component';
import { MainViewService, ViewType } from '../../services/main-view.service';
import { CommonModule } from '@angular/common';
import { RollOrderComponent } from '../roll-order/roll-order.component';

@Component({
  selector: 'app-main-view',
  standalone: true,
  imports: [
    SortableListComponent,
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

  constructor(private mainViewService: MainViewService) {
    this.currentView = this.mainViewService.getCurrentView();
  }
}
