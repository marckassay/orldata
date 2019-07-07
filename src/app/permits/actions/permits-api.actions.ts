import { createAction, props } from '@ngrx/store';
import { SearchResponse } from '@permits/permits.effects';

export const querySuccess = createAction(
  '[Permits API] Query Success',
  props<SearchResponse>()
);

export const queryFailure = createAction(
  '[Permits API] Query Failure',
  props<{ errorMsg: string }>()
);

export const distinctApplicationTypes = createAction(
  '[Permits API] Distinct Application Types',
  props<{ results: Array<{ application_type: string }> }>()
);
