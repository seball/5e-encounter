import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberToString',
  standalone: true,
})
export class NumberToStringPipe implements PipeTransform {
  transform(value: number | string): string {
    if (typeof value === 'string') {
      return value;
    }
    if (value >= 0) {
      return `+${value}`;
    } else {
      return `${value}`;
    }
  }
}
