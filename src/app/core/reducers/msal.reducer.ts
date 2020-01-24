import { AppApiActions } from '@core/actions';
import { createReducer, on } from '@ngrx/store';

export interface State {
    idp: string;
    name: string;
    error: string;
}

const initialState: State = {
    idp: '',
    name: '',
    error: '',
};

export const reducer = createReducer(
    initialState,
    on(AppApiActions.updateIdentityClaimsSuccess,
        AppApiActions.loginIdentitySuccess, (state, { idp, name }) => ({
            ...state,
            idp,
            name,
            error: '',
        })),
    on(AppApiActions.logoutIdentitySuccess, (state) => ({
        ...state,
        idp: '',
        name: '',
        error: '',
    })),
    on(AppApiActions.updateIdentityClaimsFailure, (state, { errorMsg }) => ({
        ...initialState,
        error: errorMsg,
    }))
);
