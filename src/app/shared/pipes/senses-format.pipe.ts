import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sensesFormat',
  standalone: true,
})
export class SensesFormatPipe implements PipeTransform {
  transform(value: string): string {
    if (value === 'passive_perception') {
      return 'passive Perception';
    }
    return value;
  }
}
