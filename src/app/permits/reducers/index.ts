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

export const getTableState = createSelector(
  getPermitsState,
  (state) => state.table
);

export const getSearchState = createSelector(
  getPermitsState,
  (state) => state.search
);

/*
 Table Selectors
*/

export const getEntities = createSelector(
  getPermitsState,
  (state) => state.table.entities
);

export const getPageIndex = createSelector(
  getPermitsState,
  (state) => state.table.pagination.pageIndex
);

export const getCount = createSelector(
  getPermitsState,
  (state) => state.table.pagination.count
);

export const getPageSize = createSelector<State, PermitsState, number>(
  getPermitsState,
  (state) => state.table.pagination.limit
);

export const getLastResponseTime = createSelector(
  getTableState,
  (state) => state.lastResponseTime
);

export const getSelectedTableState = createSelector(
  getTableState,
  fromTable.getSelected
);

/*
 Search Selectors
*/

export const getSelectedApplicationTypes = createSelector(
  getSearchState,
  (state) => state.selectedApplicationTypes
);

export const getDistinctApplicationTypes = createSelector(
  getSearchState,
  (state) => state.distinctApplicationTypes
);

export const getSelectedSearchState = createSelector(
  getSearchState,
  fromSearch.getSelected
);

export const getSelectedPermitsState = createSelector(
  getSelectedSearchState,
  getSelectedTableState,
  (search, table) => {
    return Object.assign({}, search, table);
  }
);
