import { createAction, props } from '@ngrx/store';

export const permitsMetadata = createAction(
  '[App API] Permits Metadata',
  props<{ metadata: Array<object> }>()
);

export const permitsMetadataFailure = createAction(
  '[App API] Permits Metadata Failure',
   props<{ errorMsg: string }>()
);

export const crimesMetadata = createAction(
  '[App API] Crimes Metadata',
  props<{ metadata: Array<object> }>()
);

export const crimesMetadataFailure = createAction(
  '[App API] Crimes Metadata Failure',
   props<{ errorMsg: string }>()
);

export const serviceActive = createAction(
  '[App API] Service Active'
);

export const serviceInactive = createAction(
  '[App API] Service Inactive'
);
