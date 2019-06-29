import { createAction, props } from '@ngrx/store';

export const getSearchFormData = createAction(
  '[PermitViewer] Search Form Data'
);

export const getSelectedSearch = createAction(
  '[PermitViewer - Route Resolve] Selected Search',
  props<{ pageIndex: number }>(),
);
