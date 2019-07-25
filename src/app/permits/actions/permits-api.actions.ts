import { createAction, props } from '@ngrx/store';
import { UpdateCountResponse, UpdateDistinctFilteredNamesResponse, UpdateEntitiesResponse } from '@permits/effects/types';

export const updateEntitiesSuccess = createAction(
  '[Permits API] Update Entities Success',
  props<UpdateEntitiesResponse>()
);

export const updateEntitiesFailure = createAction(
  '[Permits API] Update Entities Failure',
  props<{ errorMsg: string }>()
);

export const updateCountSuccess = createAction(
  '[Permits API] Update Count Success',
  props<UpdateCountResponse>()
);

export const updateCountFailure = createAction(
  '[Permits API] Update Count Failure',
  props<{ errorMsg: string }>()
);

export const updateDistinctTypesSuccess = createAction(
  '[Permits API] Update Distinct Types Success',
  props<{ results: Array<{ application_type: string }> }>()
);

export const updateDistinctTypesFailure = createAction(
  '[Permits API] Update Distinct Types Failure',
  props<{ errorMsg: string }>()
);

export const updateDistinctNamesSuccess = createAction(
  '[Permits API] Update Distinct Names Success',
  props<UpdateDistinctFilteredNamesResponse>()
);

export const updateDistinctNamesFailure = createAction(
  '[Permits API] Update Distinct Names Failure',
  props<{ errorMsg: string }>()
);
