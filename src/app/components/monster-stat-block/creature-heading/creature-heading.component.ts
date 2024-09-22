import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-creature-heading',
  templateUrl: './creature-heading.component.html',
  styleUrl: './creature-heading.component.css',
  standalone: true,
  
})
export class CreatureHeadingComponent {
  @Input() name: string = '';
  @Input() size: string = '';
  @Input() type: string = '';
  @Input() alignment: string = '';
}