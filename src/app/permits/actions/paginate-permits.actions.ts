import { createAction, props } from '@ngrx/store';

export const getSelectedPage = createAction(
  '[Paginate Permits] Selected Page',
  props<{ pageIndex: number }>()
);
