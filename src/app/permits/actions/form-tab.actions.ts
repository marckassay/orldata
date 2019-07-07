import { createAction, props } from '@ngrx/store';

export const updateSelected = createAction(
  '[Permits Form Tab] Update Selected',
  props<{
    selectedApplicationTypes: string[];
  }>()
);
