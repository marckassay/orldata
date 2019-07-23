import { TitleCasePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { EMPTY_DESERIALIZED_FIELD_LABEL } from '@app/constants';

interface MailRegExShape {
  numberstreet?: string;
  suite?: string;
  pobox?: string;
  city?: string;
  stateabrv?: string;
  zipcode?: string;
}

/**
 *
 */
@Pipe({ name: 'mailaddress' })
export class MailAddressPipe implements PipeTransform {
  /**
   * @link https://regex101.com/r/BWvpcz/3
   */
  address: RegExp = new RegExp([
    // tslint:disable-next-line: max-line-length
    '^(?:(?<numberstreet>\\d+(?:\\ |\\w|\\.)+(?=$|\\n|\\,))|(?<pobox>(?:PO|P\\.O\\.)[\\ ](?:BOX)[\\ ](?:\\d|\\-)+(?=$|\\n|\\,)))?(?:\\ *\\,\\ *)?(?<suite>(?:SUITE|STE)\\ [\\#]?(?:\\w|\\d|\\-)+)?(?:\\ *\\,\\ *)?(?<citystatezip>(?<=^|,|\\ )(?<city>[\\w\\ ]+)(?:\\ *\\,\\ *)(?<stateabrv>[A-Z]{1,3})(?:\\ +)(?<zipcode>\\d{5}(?:\\-\\d*)?))?$'
  ].join(''), 'i');
  titlecase: TitleCasePipe;

  constructor() {
    this.titlecase = new TitleCasePipe();

  }

  transform(value: string): string {
    try {
      const regExResults = this.address.exec(value);
      if (regExResults && regExResults.groups) {
        let results = '';
        const BREAK_TAG = '<br>';

        const fields: MailRegExShape = regExResults.groups;

        // if for example, if its not '123 Main St' check to see if its a pobox address
        const street = this.transformFieldAsTitle(fields.numberstreet);
        if (street === undefined) {
          const pobox = this.transformFieldAsTitle(fields.pobox);
          if (pobox) {
            results = pobox;
          }
        } else {
          results = street;
        }

        // although pobox and suite are mutually exclusive, add it anyways if it does exist
        const suite = this.transformFieldAsTitle(fields.suite);
        if (typeof suite !== 'undefined') {
          results = results.concat(BREAK_TAG, suite);
        }

        const city = this.transformFieldAsTitle(fields.city);
        const stateabrv = fields.stateabrv;
        const zipcode = fields.zipcode;
        if (city && stateabrv && zipcode) {
          results = results.concat(BREAK_TAG, city, ', ', stateabrv, ' ', zipcode);
        }

        return results;
      } else {
        value = EMPTY_DESERIALIZED_FIELD_LABEL;
      }

      return value;
    } catch (err) {
      console.error(err);
    }

    return value;
  }

  private transformFieldAsTitle = (field: string | undefined) => {
    if (field) {
      return this.titlecase.transform(field);
    }
    return undefined;
  }
}
