import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberToString',
  standalone: true
})
export class NumberToStringPipe implements PipeTransform {

  transform(value: number): string {
    if (value > 0) {
      return `+${value}`;
    } else if (value < 0) {
      return `${value}`;
    } else {
      return '0';
    }
  }

}
