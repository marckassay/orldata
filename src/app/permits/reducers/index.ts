import * as fromRoot from '@app/reducers';
import { Action, combineReducers, createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromResults from '@permits/reducers/results.reducer';
import * as fromSearch from '@permits/reducers/search.reducer';

export interface PermitsState {
  results: fromResults.State;
  search: fromSearch.State;
}

export interface State extends fromRoot.State {
  results: PermitsState;
}

/** Provide reducer in AoT-compilation happy way */
export function reducers(state: PermitsState | undefined, action: Action) {
  return combineReducers({
    results: fromResults.reducer,
    search: fromSearch.reducer,
  })(state, action);
}

export const getPermitsState = createFeatureSelector<State, PermitsState>('results');

export const getPermitEntitiesState = createSelector(
  getPermitsState,
  (state) => {
    return state.results.results;
  }
);

export const getSearchState = createSelector(
  getPermitsState,
  (state: PermitsState) => state.search
);

export const getSearchLoading = createSelector(
  getSearchState,
  fromSearch.getLoading
);
