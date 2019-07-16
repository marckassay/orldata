import { Injectable } from '@angular/core';
import { SearchRequest } from '@permits/permits.effects';

@Injectable({
  providedIn: 'root'
})
export class QueryBuilder {
  /**
   * Returns a where clause and if currentQuery co
   *
   * @param value string value from a reduced array.
   */
  where(value: SearchRequest): string {
    if (value) {
      let whereclause = 'where (';
      value.selected.selectedApplicationTypes.forEach((entry) => {
        const key = Object.keys(entry).toString();
        const val = Object.values(entry).toString();

        if (whereclause.includes(' = ')) {
          whereclause = whereclause.concat(' OR ');
        }
        whereclause = whereclause.concat(key, ` = '${val}'`);
      });
      if (value.selected.selectedDates) {
        whereclause = whereclause.concat(` AND processed_date between '${value.selected.selectedDates.end}'` +
          ` and '${value.selected.selectedDates.start}')`);
      } else {
        whereclause = whereclause.concat(' AND processed_date IS NOT NULL)');
      }

      return whereclause;
    } else {
      return '';
    }
  }
}
