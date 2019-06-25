import { createReducer, on } from '@ngrx/store';
import { PermitsApiActions } from '@permits/actions';

export interface State {

  /**
   * The result object collection from a non-query count action. Query count action does not have a
   * result object as it only returns a single object as `{COUNT: number}`.
   */
  entities: object[];

  /**
   * Used for pagination feature. `QUERY_LIMIT` has consequence to this value.
   *
   * A value of `-1` means that the view has no entities to show. Any value above `-1` indicates
   * entities should be shown.
   */
  offset: number;

  /**
   * Total number of entities determined when services called endpoint. This propperty is only set
   * when `offset` is above `-1`.
   */
  count: number;

  error: string;
}

const initialState: State = {
  entities: [],
  offset: -1,
  count: 0,
  error: ''
};

export const reducer = createReducer(
  initialState,
  on(PermitsApiActions.searchSuccess, (state, { results, offset, count }) => ({
    ...state,
    entities: results,
    offset: (offset !== -1) ? offset : state.offset,
    count: (count !== -1) ? count : state.count
  })),
  on(PermitsApiActions.searchFailure, (state, { errorMsg }) => ({
    ...state,
    error: errorMsg
  }))
);

export const getSelected = (state: State) => ({offset: state.offset});
