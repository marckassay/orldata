import * as fromRoot from '@app/reducers';
import { Action, combineReducers, createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromResults from '@permits/reducers/results.reducer';
import * as fromSearch from '@permits/reducers/search.reducer';

export interface PermitsState {
  results: fromResults.State;
  search: fromSearch.State;
}

export interface State extends fromRoot.State {
  permits: PermitsState;
}

export function reducers(state: PermitsState | undefined, action: Action) {
  return combineReducers({
    results: fromResults.reducer,
    search: fromSearch.reducer,
  })(state, action);
}

export const getPermitsState = createFeatureSelector<State, PermitsState>('permits');


/*
 Results selectors
*/
export const getPermitEntitiesState = createSelector(
  getPermitsState,
  (state) => {
    return state.results.results;
  }
);


/*
 Search selectors
*/
export const getSearchState = createSelector(
  getPermitsState,
  (state: PermitsState) => state.search
);

export const getSearchLoading = createSelector(
  getSearchState,
  fromSearch.getLoading
);

export const getSearchOffset = createSelector(
  getSearchState,
  fromSearch.getOffset
);

export const getSearchPage = createSelector(
  getSearchOffset,
  (offset) => {
    console.log(offset + 1);
    return offset + 1;
  }
);
