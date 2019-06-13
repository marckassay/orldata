import { createReducer, on } from '@ngrx/store';
import { PermitsApiActions, SearchPermitsActions } from '@permits/actions';

export interface State {
  query: string;
  offset: number;
}

const initialState: State = {
  query: '',
  offset: 0
};

export const reducer = createReducer(
  initialState,
  on(SearchPermitsActions.search, (state, { payload: { query, offset } }) => ({
    ...state,
    query,
    offset
  })),
  on(PermitsApiActions.searchSuccess, (state) => ({
    ...state,
  })),
  on(PermitsApiActions.searchFailure, (state) => ({
    ...state,
  }))
);

export const getQuery = (state: State) => state.query;

export const getOffset = (state: State) => state.offset;
