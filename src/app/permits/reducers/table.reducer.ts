import { createReducer, on } from '@ngrx/store';
import { PermitsApiActions } from '@permits/actions';

export interface State {
  entities: object[];
  error: string;
}

const initialState: State = {
  entities: [{ processed_date: '', application_type: ''}],
  error: ''
};

export const reducer = createReducer(
  initialState,
  on(PermitsApiActions.searchSuccess, (state, { results }) => ({
    ...state,
    entities: results
  })),
  on(PermitsApiActions.searchFailure, (state, { errorMsg }) => ({
    ...state,
    error: errorMsg,
  }))
);
