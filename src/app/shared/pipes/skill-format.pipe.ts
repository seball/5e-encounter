import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'skillFormat',
  standalone: true,
})
export class SkillFormatPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    return value
      .replace(/^skill-/, '')
      .replace(/-/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase());
  }
}
