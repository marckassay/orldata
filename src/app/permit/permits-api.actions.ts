import { createAction, props } from '@ngrx/store';

export const searchSuccess = createAction(
  '[Permits/API] Search Success',
  props<{ permits: object[] }>()
);

export const searchFailure = createAction(
  '[Permits/API] Search Failure',
  props<{ errorMsg: string }>()
);
