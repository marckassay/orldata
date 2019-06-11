import { AppApiActions } from '@core/actions';
import { createReducer, on } from '@ngrx/store';

export interface State {
  permitsMetadata: object | undefined;
  crimesMetadata: object | undefined;
  error: string;
}

const initialState: State = {
  permitsMetadata: undefined,
  crimesMetadata: undefined,
  error: ''
};

export const reducer = createReducer(
  initialState,
  on(AppApiActions.permitsMetadata, (state, { metadata }) => ({
    ...state,
    permitsMetadata: metadata
  })),
  on(AppApiActions.permitsMetadataFailure, (state, { errorMsg }) => ({
    ...state,
    error: errorMsg,
  })),
  on(AppApiActions.crimesMetadata, (state, { metadata }) => ({
    ...state,
    crimesMetadata: metadata
  })),
  on(AppApiActions.crimesMetadataFailure, (state, { errorMsg }) => ({
    ...state,
    error: errorMsg,
  }))
);
