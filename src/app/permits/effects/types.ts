import { ISODateString } from '@core/shared/date-converter';

export interface PaginationShape {
  pagination: {
    pageIndex: number;
    offset: number;
    limit: number;
  };
}

export type UpdateEntitiesRequest = UpdateCountRequest & PaginationShape;

/**
 * Since `selectedRadioGroupTime` value has direct consequence to `selectedDates`, it is omitted
 * from becoming a member of this interface.
 */
export interface UpdateCountRequest {
  selected: {
    selectedApplicationTypes: { application_type: string }[];
    selectedDates: { start: ISODateString, end: ISODateString };

    /**
     * When set to a non-empty string, it indicates that the effects: `updateEntities` and
     * `updateCount`, need to add an expression to the query for this feature. This is done with
     * `QueryBuilder.whereForSearch()`.
     *
     * When set to an empty string, it indicates that `updateEntities` and `updateCount` need to not
     * consider adding an expression to their query.
     */
    selectedFilterName: string;
  };
}

export interface UpdateEntitiesResponse {
  /**
   * The collection to be rendered in `Table-Tab`.
   */
  entities: object[];
  pagination: {
    pageIndex: number;
  };
  lastResponseTime: number;
}

export interface UpdateCountResponse {
  pagination: {
    readonly pageIndex: 0;
    count: number;
  };
  lastResponseTime: number;
}

export interface UpdateDistinctFilteredNamesResponse {
  selectedFilterName: string;
  distinctFilteredNames: object[];
}
