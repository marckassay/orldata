import { TitleCasePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

/**
 * Replaces underscores with a space and then invokes `TitleCasePipe`'s `transform()`.
 */
@Pipe({ name: 'labelcase' })
export class LabelCasePipe extends TitleCasePipe implements PipeTransform {
  transform(value: string | any): string {
    const valueType = typeof value;
    if (valueType !== 'string') {
      console.warn(`'LabelCasePipe' was expecting value to be 'string' type but recieved '${valueType}' type.`);
      return super.transform(value);
    } else {
      return super.transform(value as string).replace(/\_/gi, ' ');
    }
  }
}
