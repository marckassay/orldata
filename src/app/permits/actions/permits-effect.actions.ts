import { createAction } from '@ngrx/store';

export const paginateToFirst = createAction(
  '[Permits Effect - Redirect] Paginate To First',
  () => ({ pageIndex: 0 }),
);

export const loadDistincts = createAction(
  '[Permits Effect - Redirect] Load Distincts',
);
