import * as fromResults from '@app/permit/reducers/results.reducer';
import * as fromSearch from '@app/permit/reducers/search.reducer';
import * as fromRoot from '@app/reducers';
import { Action, combineReducers, createFeatureSelector, createSelector } from '@ngrx/store';

export interface PermitState {
  results: fromResults.State;
  search: fromSearch.State;
}

export interface State extends fromRoot.State {
  results: PermitState;
}

/** Provide reducer in AoT-compilation happy way */
export function reducers(state: PermitState | undefined, action: Action) {
  return combineReducers({
    results: fromResults.reducer,
    search: fromSearch.reducer,
  })(state, action);
}

export const getPermitState = createFeatureSelector<State, PermitState>('results');

export const getPermitEntitiesState = createSelector(
  getPermitState,
  (state) => {
    return state.results.results;
  }
);

export const getSearchState = createSelector(
  getPermitState,
  (state: PermitState) => state.search
);

export const getSearchLoading = createSelector(
  getSearchState,
  fromSearch.getLoading
);
