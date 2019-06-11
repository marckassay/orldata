import { createAction, props } from '@ngrx/store';

export const lastModifiedResponse = createAction(
  '[Catalog/API] Last Modified Response',
  props<{ header: object[] }>()
);

export const lastModifiedFailure = createAction(
  '[Catalog/API] Last Modified Failure',
   props<{ errorMsg: string }>()
);
