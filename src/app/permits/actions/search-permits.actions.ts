import { createAction, props } from '@ngrx/store';

export const search = createAction(
  '[Search Permits Submit] Search',
  props<{ payload: { query: string; offset: number; } }>(),
);

export const getDistinctApplicationTypes = createAction(
  '[Search Permits Form] Distinct Application Types',
);

export const getDistinctWorkTypes = createAction(
  '[Search Permits Form] Distinct Work Types',
);
