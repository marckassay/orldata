import { createAction, props } from '@ngrx/store';

export const getSelectedSearch = createAction(
  '[PageViewer - Route Resolver] Selected Search',
  props<{ page: string }>()
);

export const getSelectedFormSearch = createAction(
  '[PageViewer - Route Resolver] Selected Form Search',
  props<{ page: string }>()
);
