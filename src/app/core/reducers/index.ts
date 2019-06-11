import * as fromCatalog from '@app/core/reducers/catalog.reducer';
import * as fromRoot from '@app/reducers';
import { Action, combineReducers, createFeatureSelector, createSelector } from '@ngrx/store';

export interface CoreState {
  datasets: fromCatalog.State;
}

export interface State extends fromRoot.State {
  core: CoreState;
}

export function reducers(state: CoreState | undefined, action: Action) {
  return combineReducers({
    datasets: fromCatalog.reducer,
  })(state, action);
}

const getCoreState = createFeatureSelector<State, CoreState>('core');


/*
 Dataset Metadata selectors
*/

export const getDatasetsMetas = createSelector(
  getCoreState,
  (state: CoreState) => {
    return state.datasets;
  }
);

export const getPermitsMetadata = createSelector(
  getDatasetsMetas,
  (datasets) => datasets.permitsMetadata
);

export const getCrimesMetadata = createSelector(
  getDatasetsMetas,
  (datasets) => datasets.crimesMetadata
);
