import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-properties',
  standalone: true,
  imports: [],
  templateUrl: './properties.component.html',
  styleUrl: './properties.component.css'
})
export class PropertiesComponent {
  @Input() damageImmunities: string[] = [];
  @Input() conditionImmunities: { index: string; name: string; url: string; }[] = [];
  @Input() senses: string = '';
  @Input() languages: string = '';
  @Input() challengeRating: number = 0;
  @Input() xp: number = 0;

  getDamageImmunitiesString(): string {
    console.log(this.conditionImmunities);
    return this.damageImmunities.join(', ');
  }

  getContitionImmunitiesSting(): string {
    console.log(this.damageImmunities);
    return this.conditionImmunities.map(c => c.name).join(', ')
  }


 
}


