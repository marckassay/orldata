import * as fromRoot from '@app/reducers';
import { Action, combineReducers, createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
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

export const getPermitEntitiesState: MemoizedSelector<State, object[]> = createSelector(
  getPermitsState,
  (state) => state.table.entities
);

export const getOffset: MemoizedSelector<State, number> = createSelector(
  getPermitsState,
  (state) => state.table.offset
);

export const getCount: MemoizedSelector<State, number> = createSelector(
  getPermitsState,
  (state) => state.table.count
);


/*
 Search Selectors
*/

export const getApplicationTypes = createSelector(
  getSearchState,
  (state) => state.applicationTypes
);

export const getSelectedApplicationTypes = createSelector(
  getSearchState,
  (state) => state.selectedApplicationTypes
);

export const getWorkTypes = createSelector(
  getSearchState,
  (state) => state.workTypes
);

export const getSelectedWorkTypes = createSelector(
  getSearchState,
  (state) => state.selectedWorkTypes
);

export const getProcessedDate = createSelector(
  getSearchState,
  (state) => state.processedDate
);

export const getProcessedDateOperator = createSelector(
  getSearchState,
  (state) => state.processedDateOperator
);

export const getSecondaryProcessedDate = createSelector(
  getSearchState,
  (state) => state.secondaryProcessedDate
);

export const getSearchLimit = createSelector(
  getSearchState,
  (state) => state.limit
);
