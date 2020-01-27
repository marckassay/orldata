import { Injectable } from '@angular/core';
import { AppApiActions } from '@app/core/actions';
import * as fromCore from '@app/core/reducers';
import * as Azure from '@azure/msal-angular';
import { Store } from '@ngrx/store';
import { from, Observable, of, Subscription } from 'rxjs';

export interface TokenClaimsResponse {
    idp: string;
    name: string;
}

// export type TokenClaimsState =

@Injectable({
    providedIn: 'root',
})
/**
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev-angular-1.0-beta/lib/msal-angular/src/broadcast.service.ts
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev-angular-1.0-beta/lib/msal-angular/src/msal.service.ts
 */
export class MsalService {

    subscription: Subscription;

    constructor(
        private broadcast: Azure.BroadcastService,
        private msal: Azure.MsalService,
        private store: Store<fromCore.State>,
    ) {
        this.subscribeToRedirectCallback();
    }

    // TODO: having these broadcast.subscribe(), in an addition having logIn() and logOut(), there are going to be redunant actions.

    /**
     * these are broadcasted in the MsalService.prototype.handleRedirectCallback()
     * ref: node_modules/@azure/msal-angular/dist/msal.service.js
     */
    subscribeToRedirectCallback() {

        /**
         * ref: node_modules/msal/src/AuthResponse.ts
         */
        this.broadcast.subscribe('msal:loginSuccess', (payload) => {
            this.store.dispatch(AppApiActions.updateIdentityClaimsSuccess({
                idp: payload.account.idTokenClaims.idp,
                name: payload.account.idTokenClaims.name,
            }));
        });

        /**
         * ref: node_modules/msal/src/error/AuthError.ts
         * ref: node_modules/msal/src/error/ClientAuthError.ts
         */
        this.broadcast.subscribe('msal:loginFailure', (payload) => {
            this.store.dispatch(AppApiActions.updateIdentityClaimsFailure({ errorMsg: payload.errorMessage }));
        });

        /**
         * ref: node_modules/msal/src/AuthResponse.ts
         */
        this.broadcast.subscribe('msal:acquireTokenSuccess', (payload) => {
            this.store.dispatch(AppApiActions.updateIdentityClaimsSuccess({
                idp: payload.account.idTokenClaims.idp,
                name: payload.account.idTokenClaims.name,
            }));
        });

        /**
         * ref: node_modules/msal/src/error/AuthError.ts
         * ref: node_modules/msal/src/error/ClientAuthError.ts
         */
        this.subscription = this.broadcast.subscribe('msal:acquireTokenFailure', (payload) => {
            this.store.dispatch(AppApiActions.updateIdentityClaimsFailure({ errorMsg: payload.errorMessage }));
        });
    }

    isLoginInProgress() {
        return this.msal.getLoginInProgress();
    }

    logIn(): Observable<TokenClaimsResponse> {

        return from(this.msal.loginPopup().then((value) => {
            return {
                idp: value.account.idTokenClaims.idp,
                name: value.account.idTokenClaims.name
            };
        }));
    }

    logOut(): Observable<void> {

        return of(this.msal.logout());
    }

    // TODO: this service will be needed for the life of app. not sure if this is even neccessary.
    /*
    destroy() {
        this.broadcast.getMSALSubject().next(1);
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
    */
}
