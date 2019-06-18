import { createAction, props } from '@ngrx/store';

export const searchSuccess = createAction(
  '[Permits API] Search Success',
  props<{ results: object[], offset: number, count: number }>()
);

export const searchFailure = createAction(
  '[Permits API] Search Failure',
  props<{ errorMsg: string }>()
);

export const distinctApplicationTypes = createAction(
  '[Permits API] Distinct Application Types',
  props<{ results: Array<{ application_type: string }> }>()
  );

export const distinctWorkTypes = createAction(
    '[Permits API] Distinct Work Types',
    props<{ results: object[] }>()
);

export const distinctTypesFailure = createAction(
    '[Permits API] Distinct Types Failure',
  props<{ errorMsg: string }>()
);
