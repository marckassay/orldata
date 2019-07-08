import { InjectionToken } from '@angular/core';
import { ContentName } from '@app/constants';
import * as fromCore from '@core/reducers';
/**
 * Every reducer module's default export is the reducer function itself. In
 * addition, each module should export a type or interface that describes
 * the state of the reducer plus any selector functions. The `* as`
 * notation packages up all of the exports into a single object.
 */
import * as fromRouter from '@ngrx/router-store';
import { getSelectors } from '@ngrx/router-store';
import { Action, ActionReducer, ActionReducerMap, createFeatureSelector, MemoizedSelector, MetaReducer } from '@ngrx/store';
import { DefaultProjectorFn } from '@ngrx/store/src/selector';
import { getCount as getPermitsCount, getDistinctApplicationTypes as getPermitsApplicationTypes, getLastResponseTime as getPermitsLastResponseTime } from '@permits/reducers';
import { environment } from '../../environments/environment';

/**
 * As mentioned, we treat each reducer like a table in a database. This means
 * our top level state interface is just a map of keys to inner state types.
 */
export interface State {
  router: fromRouter.RouterReducerState<any>;
  core: fromCore.CoreState;
}

/**
 * Our state is composed of a map of action reducer functions.
 * These reducer functions are called with each dispatched action
 * and the current or initial state and return a new immutable state.
 */
export const ROOT_REDUCERS = new InjectionToken<
  ActionReducerMap<State, Action>
>('Root reducers token', {
  factory: () => ({
    router: fromRouter.routerReducer,
    core: fromCore.reducers
  }),
});

// console.log all actions
export function logger(reducer: ActionReducer<State>): ActionReducer<State> {
  return (state, action) => {
    const result = reducer(state, action);
    console.groupCollapsed(action.type);
    console.log('prev state', state);
    console.log('action', action);
    console.log('next state', result);
    console.groupEnd();

    return result;
  };
}

/**
 * By default, @ngrx/store uses combineReducers with the reducer map to compose
 * the root meta-reducer. To add more meta-reducers, provide an array of meta-reducers
 * that will be composed to form the root meta-reducer.
 */
export const metaReducers: MetaReducer<State>[] = !environment.production
  ? [logger]
  : [];

export const selectRouter = createFeatureSelector<
  State,
  fromRouter.RouterReducerState<any>
>('router');

export const {
  selectQueryParams,    // select the current route query params
  selectRouteParams,    // select the current route params
  selectRouteData,      // select the current route data
  selectUrl,            // select the current url
} = getSelectors(selectRouter);

/**
 * With provided `content` will return it's feature's `getCount` selector.
 *
 * TODO: I'm sure there is a more elegant way to go about this. I referenced the following:
 * @link https://blog.angularindepth.com/ngrx-parameterized-selector-e3f610529f8
 *
 * @param content the feature name that is a property of root state.
 */
export function getSelectedCount(content: ContentName): MemoizedSelector<any, number, DefaultProjectorFn<number>> {
  switch (content) {
    case ContentName.Permits: return getPermitsCount;
    default: return getPermitsCount;
  }
}

export function getLastResponseTime(content: ContentName): MemoizedSelector<any, number, DefaultProjectorFn<number>> {
  switch (content) {
    case ContentName.Permits: return getPermitsLastResponseTime;
    default: return getPermitsLastResponseTime;
  }
}

export function getDistinctData(content: ContentName): MemoizedSelector<any,
  { application_type: string; }[] | undefined,
  DefaultProjectorFn<{ application_type: string; }[] | undefined>> {
  switch (content) {
    case ContentName.Permits: return getPermitsApplicationTypes;
    default: return getPermitsApplicationTypes;
  }
}
