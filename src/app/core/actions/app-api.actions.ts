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
/*
export const msalLoginSuccess = createAction(
  '[MSAL API] Login Success'
);

export const msalLoginFailure = createAction(
  '[MSAL API] Login Failure'
);

export const msalAcquireTokenSuccess = createAction(
  '[MSAL API] Acquire Token Success',
  props<{
    idp: string;
    name: string;
  }>()
);

export const msalAcquireTokenFailure = createAction(
  '[MSAL API] Acquire Token Failure'
); */

export const updateIdentityClaimsSuccess = createAction(
  '[MSAL API] Update Identity Claims Success',
  props<{
    idp: string;
    name: string;
  }>()
);

export const updateIdentityClaimsFailure = createAction(
  '[MSAL API] Update Identity Claims Failure',
  props<{ errorMsg: string }>()
);
