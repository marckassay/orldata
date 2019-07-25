import { Injectable } from '@angular/core';
import { PERMITS_SEARCHABLE_FILEDS } from '@app/constants';
import { UpdateCountRequest, UpdateEntitiesRequest } from '@permits/effects/types';

@Injectable({
  providedIn: 'root'
})
/**
 *
 */
export class QueryBuilder {
  /**
   * Returns a where clause and if currentQuery co
   *
   * @param value string value from a reduced array.
   */
  where(value: UpdateEntitiesRequest | UpdateCountRequest): string {
    let whereclause = 'where=';

    // examples for the following block:
    // (application_type = 'Building Permit')
    // (application_type = 'Building Permit' or application_type='GAS')
    const lastIndex = (value.selected.selectedApplicationTypes.length) - 1;
    value.selected.selectedApplicationTypes.forEach((entry, index) => {
      const key = Object.keys(entry).toString();
      const val = Object.values(entry).toString();

      if (index === 0) {
        whereclause = whereclause.concat('(');
      } else {
        whereclause = whereclause.concat(' or ');
      }

      whereclause = whereclause.concat(key, ` = '${val}'`);

      if (index === lastIndex) {
        whereclause = whereclause.concat(')');
      }
    });

    whereclause = whereclause.concat(' AND ');

    // example for the following block:
    // (processed_date between '2019-06-17T20:43:23.467' and '2019-07-17T20:43:23.465')
    if (value.selected.selectedDates) {
      whereclause = whereclause.concat(`(processed_date between '${value.selected.selectedDates.end}'` +
        ` and '${value.selected.selectedDates.start}')`);
    } else {
      whereclause = whereclause.concat('(processed_date IS NOT NULL)');
    }

    // condensed example for the following block:
    // (property_owner_name like upper('%25Verg%25') or ... like upper('%25Verg%25'))
    if (value.selected.selectedFilterName !== '') {
      whereclause = whereclause.concat(' AND (');

      const selectedFilterName = value.selected.selectedFilterName;
      PERMITS_SEARCHABLE_FILEDS.forEach((field) => {
        whereclause = whereclause.concat(`${field} like upper('%25${selectedFilterName}%25') or `);
      });

      // could of done this in the iterater above, but performance of more importance
      whereclause = whereclause.slice(0, -4).concat(')');
    }

    if (this.isUpdateCountRequest(value) === true) {
      whereclause = whereclause.concat(' |> SELECT DISTINCT * |> SELECT COUNT(*)');
    }

    return whereclause;
  }

  private isUpdateCountRequest = (value: UpdateEntitiesRequest | UpdateCountRequest) => ((value as any).pagination === undefined);
}
