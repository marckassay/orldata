import { PermitsApiActions } from '@app/permit/actions';
import { createReducer, on } from '@ngrx/store';

export interface State {
  results: object[];
}

const initialState: State = {
  results: [{ processed_date: '', application_type: ''}],
};

export const reducer = createReducer(
  initialState,
  on(PermitsApiActions.searchSuccess, (state, { results }) => ({
    ...state,
    results
  }))/* ,
  on(PermitsApiActions.searchFailure, (state, { errorMsg }) => ({
    ...state,
    loading: false,
    error: errorMsg,
  })) */
);
