import { Pipe, PipeTransform } from '@angular/core';

/**
 * If value is exceeds 100, a plus sign is appended to it as a string.
 */
@Pipe({ name: 'mailaddress' })
export class MailAddressPipe implements PipeTransform {

  // @link https://regex101.com/r/0wsBDj/1
  // tslint:disable-next-line: max-line-length
  address: RegExp = /^(?<numberstreet>\d+(?:\s+\w+)*)(?:\s*[\,]\s*)(?<suite>[A-Z\s0-9\#]*[,])?(?<city>[^\,\s][\w\s]+)(?:\s*[\,]\s*)(?<stateabrv>[A-Z]{1,3})(?:\s+)(?<zipcode>\d{5}(?:\-\d*)?)$/;

  captureFirstChar: RegExp = /[\s][A-Z](?=[A-Z])/;

  transform(value: string): string {

    try {

      const regExResults = this.address.exec(value);

      if (regExResults && regExResults.groups) {
        let addressString = '';

        regExResults.groups = (regExResults.groups as {
          numberstreet: string;
          suite: string;
          city: string;
          stateabrv: string;
          zipcode: string;
        });

        let firstCharUppers: RegExpExecArray | null = this.captureFirstChar.exec(regExResults.groups.numberstreet);
        let lowered = regExResults.groups.numberstreet.toLocaleLowerCase();
        if (firstCharUppers) {
          firstCharUppers.forEach((val: string) => {
            lowered = lowered.replace(val.toLowerCase(), val);
          });
          addressString = lowered;
        }

        if (regExResults.groups.suite) {
          addressString += '<br>' + regExResults.groups.suite;
        }

        let city = regExResults.groups.city;
        firstCharUppers = this.captureFirstChar.exec(regExResults.groups.city);
        lowered = regExResults.groups.city.toLocaleLowerCase();
        if (firstCharUppers) {
          firstCharUppers.forEach((val: string) => {
            lowered = lowered.replace(val.toLowerCase(), val);
          });

          city = lowered;
        }

        addressString += '<br>' + city + ', ' + regExResults.groups.stateabrv + ' ' + regExResults.groups.zipcode;
        return addressString;
      } else {
        return value;
      }
    } catch (err) {
      console.error(err);
    }

    return value;
  }
}
