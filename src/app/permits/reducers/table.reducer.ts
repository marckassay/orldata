import { createReducer, on } from '@ngrx/store';
import { PermitsApiActions, PermitsTableTabActions } from '@permits/actions';

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

  /**
   * This flag indicates that the component hasn't confirmed if the table has completed rendering
   * itself with new data.
   *
   * This has been created to circumvent the limitation mentioned in the link below:
   *
   * @link https://github.com/angular/components/issues/8068#issuecomment-342307762
   */
  dirty: boolean | undefined;

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
  dirty: undefined,
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
    lastResponseTime,
    dirty: (typeof state.dirty !== 'undefined')
  })),
  on(PermitsApiActions.updateCountSuccess, (state, { pagination: { pageIndex, count }, lastResponseTime }) => ({
    ...state,
    pagination: {
      pageIndex,
      count,
      limit: state.pagination.limit
    },
    lastResponseTime,
    dirty: (typeof state.dirty !== 'undefined')
  })),
  on(PermitsTableTabActions.cleaned, (state) => ({
    ...state,
    dirty: false
  })),
  on(PermitsApiActions.updateEntitiesFailure, (state, { errorMsg }) => ({
    ...state,
    error: errorMsg,
    dirty: (typeof state.dirty !== 'undefined')
  })),
);

/**
 * As with other `getSelected()`, returns all variables that the user can adjust on this page.
 */
export const getSelected = (state: State) => ({ pageIndex: state.pagination.pageIndex });
