import { createReducer, on } from '@ngrx/store';
import { PermitsApiActions } from '@permits/actions';

export interface State {
  results: object[];
  error: string;
}

const initialState: State = {
  results: [{ processed_date: '', application_type: ''}],
  error: ''
};

export const reducer = createReducer(
  initialState,
  on(PermitsApiActions.searchSuccess, (state, { results }) => ({
    ...state,
    results
  })),
  on(PermitsApiActions.searchFailure, (state, { errorMsg }) => ({
    ...state,
    error: errorMsg,
  }))
);
