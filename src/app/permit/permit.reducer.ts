import { createReducer, on } from '@ngrx/store';
import { PermitsApiActions } from '.';

export interface State {
  permits: string[];
  loading: boolean;
  error: string;
  filter: string;
  offset: number;
}

const initialState: State = {
  permits: [],
  loading: false,
  error: '',
  filter: '',
  offset: 0
};

export const reducer = createReducer(
  initialState,
  on(searchFilteredPermits.type, (state, { filter }) => {
    return filter === ''
      ? {
        permits: [],
        loading: false,
        error: '',
        filter: '',
        offset: 0
      }
      : {
        ...state,
        loading: true,
        error: '',
        filter,
      };
  }),
  on(PermitsApiActions.searchSuccess, (state, { permits }) => ({
    permits,
    loading: false,
    error: '',
    filter: state.filter,
  })),
  on(PermitsApiActions.searchFailure, (state, { errorMsg }) => ({
    ...state,
    loading: false,
    error: errorMsg,
  }))
);

export const getPermits = (state: State) => state.permits;

export const getFilter = (state: State) => state.filter;

export const getLoading = (state: State) => state.loading;

export const getError = (state: State) => state.error;
