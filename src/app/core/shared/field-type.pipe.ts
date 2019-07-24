import { Pipe, PipeTransform } from '@angular/core';
import { FieldType } from '@app/constants';

/**
 *
 */
@Pipe({ name: 'fieldtype' })
export class FieldTypePipe implements PipeTransform {

  transform(value: string | any): string {

    if (typeof value === 'string') {
      // order matters! contractor_address is returned before contractor_name
      if (value.includes('address') === true) {
        return FieldType.Address.toString();
      } else if (value.includes('geocoded_column') === true) {
        return FieldType.Coordinates.toString();
      } else if (value.includes('cost') === true) {
        return FieldType.Currency.toString();
      } else if (value.includes('date') === true) {
        return FieldType.Date.toString();
      } else if (
        (value.trim().length === 0) ||
        (value.includes('name') === true) ||
        (value.includes('type') === true) ||
        (value.includes('contractor') === true)
      ) {
        // e.g.: application_type, work_type, contractor_name, contractor
        return FieldType.Label.toString();
      } else {
        // e.g.: permit_number
        return FieldType.Other.toString();
      }
    } else {
      return FieldType.Other.toString();
    }
  }
}
