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
    if (typeof value === 'string') {
      if ((value.trim().length === 0) || (value === EMPTY_DESERIALIZED_FIELD_LABEL)) {
        return EMPTY_DESERIALIZED_FIELD_LABEL;
      } else {
        // replace underscores with a space
        return super.transform(value.replace(/\_/gi, ' '));
      }
    } else {
      return EMPTY_DESERIALIZED_FIELD_LABEL;
    }
  }
}
