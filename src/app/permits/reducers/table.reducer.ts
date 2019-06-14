import { createReducer, on } from '@ngrx/store';
import { PermitsApiActions } from '@permits/actions';

export interface State {
  entities: object[];

  /**
   * Used for pagination feature. `limit` has consequence to this value.
   */
  offset: number;

  /**
   * Total number of entities determined when services called endpoint. `offset` has no consequence
   * to this value.
   */
  count: number;

  error: string;
}

const initialState: State = {
  entities: [],
  offset: 0,
  count: 0,
  error: ''
};

export const reducer = createReducer(
  initialState,
  on(PermitsApiActions.searchSuccess, (state, { results, count }) => ({
    ...state,
    entities: results,
    count
  })),
  on(PermitsApiActions.searchFailure, (state, { errorMsg }) => ({
    ...state,
    error: errorMsg,
  }))
);
