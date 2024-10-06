import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'savingThrowFormat',
  standalone: true,
})
export class SavingThrowFormatPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    const parts = value.split('-');
    return parts[parts.length - 1].toUpperCase();
  }
}
