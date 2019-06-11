import { createAction, props } from '@ngrx/store';


export const requestForLastModifiedDate = createAction(
  '[Search Permits] Last Modified Date',
);

export const queryPermits = createAction(
  '[Search Permits] Query Permits',
  props<{ payload: { query: string; offset: number; } }>(),
);

export const getDistinctApplicationTypes = createAction(
  '[Search Permits] Distinct Application Types',
);
