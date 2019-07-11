import { Pipe, PipeTransform } from '@angular/core';

/**
 * If value is exceeds 100, a plus sign is appended to it as a string.
 */
@Pipe({ name: 'numericlimit' })
export class NumericLimitPipe implements PipeTransform {
  transform(value: number | any): string {
    value = (typeof value === 'number') ? value : 0;
    return (value > 100) ? '100+' : value.toString();
  }
}
