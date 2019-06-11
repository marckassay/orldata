import * as fromHeader from '@app/core/reducers/header.reducer';
import * as fromRoot from '@app/reducers';
import { Action, combineReducers, createFeatureSelector, createSelector } from '@ngrx/store';

export interface CoreState {
  header: fromHeader.State;
}

export interface State extends fromRoot.State {
  core: CoreState;
}

export function reducers(state: CoreState | undefined, action: Action) {
  return combineReducers({
    header: fromHeader.reducer,
  })(state, action);
}

export const getCoreState = createFeatureSelector<State, CoreState>('core');


/*
 Header selectors
*/
export const geHeaderState = createSelector(
  getCoreState,
  (state: CoreState) => {
    return state.header;
  }
);

/*
export const getSearchState = createSelector(
  getPermitsState,
  (state: PermitsState) => state.search
);

export const getSearchLoading = createSelector(
  getSearchState,
  fromSearch.getLoading
); */
