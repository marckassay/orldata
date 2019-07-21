import { TitleCasePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { EMPTY_DESERIALIZED_FIELD_LABEL } from '@app/constants';

/**
 * Replaces underscores with a space and if the string is empty will return the value of
 * `EMPTY_DESERIALIZED_FIELD_LABEL`. Afterwards invokes `TitleCasePipe`'s `transform()` as that
 * pipe is its super.
 */
@Pipe({ name: 'labelcase' })
export class LabelCasePipe extends TitleCasePipe implements PipeTransform {
  transform(value: string | any): string {
    const valueType = typeof value;
    if (valueType !== 'string') {
      console.warn(`'LabelCasePipe' was expecting value to be 'string' type but recieved '${valueType}' type.`);
      return super.transform(value);
    } else {
      if ((value as string).trim().length === 0) {
        return value = EMPTY_DESERIALIZED_FIELD_LABEL;
      } else {
        return super.transform(value as string).replace(/\_/gi, ' ');
      }
    }
  }
}
