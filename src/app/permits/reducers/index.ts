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

/* export const getWorkTypes = createSelector(
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
); */

/* export const getSearchLimit = createSelector(
  getSearchState,
  (state) => state.limit
);
 */

export const getSearchSelectedState = createSelector(
  getSearchState,
  fromSearch.getSelected
);

export const getTableSelectedState = createSelector(
  getTableState,
  fromTable.getSelected
);


export const getPermitSelectedState: MemoizedSelector<State,
{ selectedApplicationTypes: string[], offset: number}> = createSelector(
  getSearchSelectedState,
  getTableSelectedState,
  (search, table) => {
    return Object.assign({}, search, table);
  }
);

// https://stackoverflow.com/a/53025968/648789
/* let deepClone = <T>(source: T): { [k: string]: any } => {
  const results: { [k: string]: any } = {};
  for (let P in source) {
    if (source[P] !== null && typeof source[P] === 'object') {
      results[P] = deepClone(source[P]);
    } else {
      results[P] = source[P];
    }
  }
  return results;
}; */
