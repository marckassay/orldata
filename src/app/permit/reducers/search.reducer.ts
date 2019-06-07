import { PermitsApiActions, SearchPermitsActions } from '@app/permit/actions';
import { createReducer, on } from '@ngrx/store';

export interface State {
  loading: boolean;
  error: string;
  query: string;
  offset: number;
}

const initialState: State = {
  loading: false,
  error: '',
  query: '',
  offset: 0
};

export const reducer = createReducer(
  initialState,
  on(SearchPermitsActions.queryPermits, (state, {payload: { query, offset }}) => {
    return query === ''
      ? {
        loading: false,
        error: '',
        query,
        offset
      }
      : {
        ...state,
        loading: true,
        error: '',
        query,
        offset
      };
  }),
  on(PermitsApiActions.searchSuccess, (state, { results }) => ({
    ...state,
    loading: false
  }))
);

export const getQuery = (state: State) => state.query;

export const getOffset = (state: State) => state.offset;

export const getLoading = (state: State) => state.loading;

export const getError = (state: State) => state.error;
