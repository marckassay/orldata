import { createReducer, on } from '@ngrx/store';
import { PermitsApiActions } from '@permits/actions';

export interface State {

  /**
   * The collection of entities for table from `PermitViewerActions.getSelectedSearch` action.
   */
  entities: object[] | undefined;

  pagination: {

    /**
     * Used for table pagination feature that is set post service queries.
     *
     * `pagination.limit` is a consequence to this value. Index starts at `0`.
     */
    pageIndex: number;

    /**
     * Total number of entities from last query that was done in the `Form-Tab`.
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
  on(PermitsApiActions.updateEntitiesSuccess, (state, { entities, pagination: { pageIndex }, lastResponseTime }) => ({
    ...state,
    entities,
    pagination: {
      pageIndex,
      count: state.pagination.count,
      limit: state.pagination.limit
    },
    lastResponseTime
  })),
  on(PermitsApiActions.updateCountSuccess, (state, { pagination: { pageIndex, count }, lastResponseTime }) => ({
    ...state,
    pagination: {
      pageIndex,
      count,
      limit: state.pagination.limit
    },
    lastResponseTime
  })),
  on(PermitsApiActions.updateEntitiesFailure, (state, { errorMsg }) => ({
    ...state,
    error: errorMsg
  }))
);

/**
 * As with other `getSelected()`, returns all variables that the user can adjust on this page.
 */
export const getSelected = (state: State) => ({ pageIndex: state.pagination.pageIndex });
