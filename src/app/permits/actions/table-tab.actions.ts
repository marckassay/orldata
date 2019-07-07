import { createAction, props } from '@ngrx/store';

export const paginate = createAction(
  '[Permits Table Tab] Paginate',
  props<{ pageIndex: number }>()
);
