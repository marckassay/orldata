import { AppApiActions } from '@core/actions';
import { createReducer, on } from '@ngrx/store';

export interface State {
  current: number;
  servicesCommunicating: boolean;
}

const initialState: State = {
  current: 0,
  servicesCommunicating: false,
};

export const reducer = createReducer(
  initialState,
  on(AppApiActions.serviceCurrentlyCommunicating, (state) => ({
    current: state.current + 1,
    servicesCommunicating: true
  })),
  on(AppApiActions.serviceCurrentlyCompleted, (state) => ({
    current: state.current - 1,
    servicesCommunicating: state.current === 0
  }))
);
