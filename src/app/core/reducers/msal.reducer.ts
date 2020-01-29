import { AppApiActions } from '@core/actions';
import { createReducer, on } from '@ngrx/store';

export interface State {
    uniqueId: string;
    idp: string;
    name: string;
    error: string;
}

const initialState: State = {
    uniqueId: '',
    idp: '',
    name: '',
    error: '',
};

export const reducer = createReducer(
    initialState,
    on(AppApiActions.updateIdentityClaimsSuccess,
        AppApiActions.loginIdentitySuccess, (state, { uniqueId, idp, name }) => ({
            uniqueId,
            idp,
            name,
            error: ''
        })),
    on(AppApiActions.logoutIdentitySuccess, (state) => ({
        ...initialState
    })),
    on(AppApiActions.updateIdentityClaimsFailure, (state, { errorMsg }) => ({
        ...initialState,
        error: errorMsg,
    }))
);
