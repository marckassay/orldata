import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QueryBuilder {
  /**
   * Returns a where clause and if currentQuery co
   *
   * @param value string value from a reduced array.
   */
  where(value: any): string {
    const key = Object.keys(value);
    const keysValue: string[] | string = value[key[0]];

    if (Array.isArray(keysValue)) {
      return keysValue.reduce(
      (accumulator: string, currentValue: string, index: number, src: string[]) => {
          if (index > 0) {
            const entry = (index + 1 !== src.length) ? `${key} = '${currentValue}' OR ` : `${key} = '${currentValue}')`;
            return accumulator.concat(entry);
          } else {
            return accumulator;
          }
      }, 'where (');
    } else {
      return '';
    }
  }
}















  // map

  /* return (value).reduce(
    (accumulator: any, currentValue: string, index: number, src: []) =>
      accumulator.concat(currentValue, (index + 1 !== src.length) ? `${key} = '${currentValue}' OR ` : `${key} = '${currentValue}') AND`)
    , 'where ('); */
     /*
    // where (application_type = 'Building Permit' OR application_type = 'GAS') AND
    return (value).reduce(
      (accumulator: any, currentValue: string, index: number, src: []) =>
       accumulator.concat(currentValue, (index + 1 !== src.length) ? `${key} = '${currentValue}' OR ` : `${key} = '${currentValue}') AND`)
    , 'where (');
 */
    // const    =  + key + ' = ';


/*     for (let [key, value] of Object.entries()) {
      console.log(`where ${key} = '${value}'`);
    } */

  // }
