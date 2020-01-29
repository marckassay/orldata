import { createAction, props } from '@ngrx/store';
import { TokenResponse } from '../services/msal.service';

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

export const updateIdentityClaimsSuccess = createAction(
  '[MSAL API] Update Identity Claims Success',
  props<TokenResponse>()
);

export const updateIdentityClaimsFailure = createAction(
  '[MSAL API] Update Identity Claims Failure',
  props<{ errorMsg: string }>()
);

export const loginClicked = createAction(
  '[Account Settings - Identity] Login Clicked'
);

export const loginIdentitySuccess = createAction(
  '[MSAL API] Login Identity Success',
  props<TokenResponse>()
);

export const loginIdentityFailure = createAction(
  '[MSAL API] Login Identity Failure',
  props<{ errorMsg: string }>()
);

export const logoutClicked = createAction(
  '[Account Settings - Identity] Logout Clicked'
);

export const logoutIdentitySuccess = createAction(
  '[MSAL API] Logout Identity Success'
);

export const logoutIdentityFailure = createAction(
  '[MSAL API] Logout Identity Failure',
  props<{ errorMsg: string }>()
);

export const catalogGuardTokenRequest = createAction(
  '[Catalog - Guard] Acquire Token Silent',
  props<{
    scopes: Array<string>;
  }>()
);

export const acquireTokenSilentSuccess = createAction(
  '[MSAL API] Logout Identity Success'
);

export const acquireTokenSilentFailure = createAction(
  '[MSAL API] Logout Identity Failure',
  props<{ errorMsg: string }>()
);
