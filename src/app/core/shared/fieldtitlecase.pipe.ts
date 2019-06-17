import { TitleCasePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
/**
 * Since field (column) names may have an underscore, this pipe is to replace the underscore with a
 * space and call `TitleCasePipe`'s `transform()`.
 */
@Pipe({ name: 'fieldtitlecase' })
export class FieldTitleCasePipe extends TitleCasePipe implements PipeTransform {
  transform(value: string): string {
    if (value) {
      value = value.replace('_', ' ');
    }

    return super.transform(value);
  }
}
