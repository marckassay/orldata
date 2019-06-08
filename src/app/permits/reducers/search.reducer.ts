import { createReducer, on } from '@ngrx/store';
import { PermitsApiActions, SearchPermitsActions } from '@permits/actions';

export interface State {
  loading: boolean;
  query: string;
  offset: number;
}

const initialState: State = {
  loading: false,
  query: '',
  offset: 0
};

export const reducer = createReducer(
  initialState,
  on(SearchPermitsActions.queryPermits, (state, { payload: { query, offset } }) => ({
    ...state,
    loading: true,
    query,
    offset
  })),
  on(PermitsApiActions.searchSuccess, (state) => ({
    ...state,
    loading: false
  })),
  on(PermitsApiActions.searchFailure, (state) => ({
    ...state,
    loading: false
  }))
);

export const getQuery = (state: State) => state.query;

export const getOffset = (state: State) => state.offset;

export const getLoading = (state: State) => state.loading;
