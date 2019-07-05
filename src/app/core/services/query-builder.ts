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
