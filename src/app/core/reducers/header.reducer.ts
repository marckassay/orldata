import { CatalogApiActions } from '@core/actions';
import { createReducer, on } from '@ngrx/store';

export interface State {
  header: object[];
  error: string;
}

const initialState: State = {
  header: [],
  error: ''
};

export const reducer = createReducer(
  initialState,
  on(CatalogApiActions.lastModifiedResponse, (state, { header }) => ({
    ...state,
    header
  })),
  on(CatalogApiActions.lastModifiedFailure, (state, { errorMsg }) => ({
    ...state,
    error: errorMsg,
  }))
);
