import { Component } from '@angular/core';
import { SortableListComponent } from '../../shared/ui/sortable-list/sortable-list.component';
import { CharacterService } from '../../services/character.service';

@Component({
  selector: 'app-roll-order',
  standalone: true,
  imports: [SortableListComponent],
  templateUrl: './roll-order.component.html',
  styleUrl: './roll-order.component.scss',
})
export class RollOrderComponent {
  constructor(private readonly characterService: CharacterService) {}
}
