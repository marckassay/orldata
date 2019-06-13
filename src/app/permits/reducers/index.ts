import * as fromRoot from '@app/reducers';
import { Action, combineReducers, createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromSearch from '@permits/reducers/search.reducer';
import * as fromTable from '@permits/reducers/table.reducer';

export interface PermitsState {
  table: fromTable.State;
  search: fromSearch.State;
}

export interface State extends fromRoot.State {
  permits: PermitsState;
}

export function reducers(state: PermitsState | undefined, action: Action) {
  return combineReducers({
    table: fromTable.reducer,
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
    return state.table.entities;
  }
);


/*
 Search selectors
*/
export const getSearchState = createSelector(
  getPermitsState,
  (state: PermitsState) => state.search
);

export const getSearchOffset = createSelector(
  getSearchState,
  fromSearch.getOffset
);

export const getSearchPage = createSelector(
  getSearchOffset,
  (offset) => {
    return offset + 1;
  }
);
