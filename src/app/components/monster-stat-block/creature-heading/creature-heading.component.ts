import { Component, Input, ViewEncapsulation } from '@angular/core';
import { TaperedRuleComponent } from "../../../shared/ui/tapered-rule/tapered-rule.component";

@Component({
  selector: 'app-creature-heading',
  templateUrl: './creature-heading.component.html',
  styleUrl: './creature-heading.component.css',
  standalone: true,
  imports: [TaperedRuleComponent],
  
})
export class CreatureHeadingComponent {
  @Input() name: string = '';
  @Input() size: string = '';
  @Input() type: string = '';
  @Input() alignment: string = '';
}