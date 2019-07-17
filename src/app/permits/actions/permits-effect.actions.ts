import { createAction, props } from '@ngrx/store';
import { UpdateCountRequest } from '@permits/effects/types';

export const paginateToFirst = createAction(
  '[Permits TableTabResolver - Resolve] Paginate To First',
  () => ({ pageIndex: 0 }),
);

export const loadDistincts = createAction(
  '[Permits FormTabResolver - Resolve] Load Distincts',
);

export const updateDistinctNames = createAction(
  '[Permits Effect - Exec] Update Distinct Names',
  props<UpdateCountRequest>()
);
