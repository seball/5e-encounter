import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NameDescription } from '../../../interfaces/statblock.interface';
import { EditableNameDescriptionArrayComponent } from '../../../shared/ui/editable-name-description-array/editable-name-description-array.component';

@Component({
  selector: 'app-special-abilities',
  standalone: true,
  imports: [CommonModule, EditableNameDescriptionArrayComponent],
  templateUrl: './special-abilities.component.html',
  styleUrl: './special-abilities.component.scss',
})
export class SpecialAbilitiesComponent {
  @Input() abilities: NameDescription[] = [];
  @Input() editMode = false;
  @Output() abilitiesChange = new EventEmitter<NameDescription[]>();

  onAbilitiesChange(newAbilities: NameDescription[]) {
    this.abilitiesChange.emit(newAbilities);
  }
}
