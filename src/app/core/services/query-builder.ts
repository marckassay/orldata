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
  where(value: object[]): string {
    if (value.length) {
      let whereclause = 'where (';
      value.forEach((entry) => {
        const key = Object.keys(entry).toString();
        const val = Object.values(entry).toString();

        if (whereclause.includes(' = ')) {
          whereclause = whereclause.concat(' OR ');
        }
        whereclause = whereclause.concat(key, ` = '${val}'`);
      });
      whereclause = whereclause.concat(' AND processed_date IS NOT NULL)');
      return whereclause;
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
