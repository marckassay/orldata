import { createReducer, on } from '@ngrx/store';
import { PermitsApiActions } from '@permits/actions';

export interface State {

  /**
   * The collection of entities for table from `PermitViewerActions.getSelectedSearch` action.
   */
  entities: object[] | undefined;

  pagination: {
    /**
     * Used for table pagination feature. `QUERY_LIMIT` is of consequence to this value.
     *
     * A value of `-1` means that the table has no entities to show as the application is still in
     * "search mode" (user is interacting in Form tab). Any value above `-1` indicates entities should
     * be shown.
     */
    pageIndex: number;

    /**
     * Total number of entities from last query that was done in the `Form-Tab`. This property is only
     * set when `pageIndex` is `-1`.
     */
    count: number;

    /**
     * The number of entities to be shown on one page.
     *
     * With this value, multiplied with `pageIndex` will produced a value to be used in the services
     * named, 'offset'.
     */
    limit: 40 | 80 | 160;
  };

  /**
   * The last response time from services. This is set regardless if any data changed.
   */
  lastResponseTime: number;

  error: string;
}

const initialState: State = {
  entities: undefined,
  pagination: {
    pageIndex: 0,
    count: 0,
    limit: 40,
  },
  lastResponseTime: 0,
  error: ''
};

export const reducer = createReducer(
  initialState,
  on(PermitsApiActions.searchSuccess, (state, { entities, pagination: { pageIndex, count }, lastResponseTime}) => ({
    ...state,
    entities,
    pagination: {
      pageIndex: (pageIndex !== -1) ? pageIndex : state.pagination.pageIndex,
      count: (count !== -1) ? count : state.pagination.count,
      limit: state.pagination.limit
    },
    lastResponseTime
  })),
  on(PermitsApiActions.searchFailure, (state, { errorMsg }) => ({
    ...state,
    error: errorMsg
  }))
);

/**
 * As with other `getSelected()`, returns all variables that the user can adjust on this page.
 */
export const getSelected = (state: State) => ({ pageIndex: state.pagination.pageIndex });
