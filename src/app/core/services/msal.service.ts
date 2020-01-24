import { Injectable } from '@angular/core';
import * as fromCore from '@app/core/reducers';
import * as Azure from '@azure/msal-angular';
import { Store } from '@ngrx/store';
import { from, Observable, of, Subscription } from 'rxjs';

export interface TokenClaimsResponse {
    idp: string;
    name: string;
}

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
        this.init();
    }

    init() {
        /*         this.broadcast.subscribe('msal:loginSuccess', (payload) => {
                    this.store.dispatch(AppApiActions.updateIdentityClaimsSuccess({
                        idp: payload.account.idTokenClaims.idp,
                        name: payload.account.idTokenClaims.name,
                    }));
                });

                this.broadcast.subscribe('msal:loginFailure', (payload) => {
                    this.store.dispatch(AppApiActions.updateIdentityClaimsFailure(payload.errorMessage));
                });
                this.broadcast.subscribe('msal:acquireTokenSuccess', (payload) => {
                    this.store.dispatch(AppApiActions.updateIdentityClaimsSuccess({
                        idp: payload.account.idTokenClaims.idp,
                        name: payload.account.idTokenClaims.name,
                    }));
                }); */

        /**
         * errorCode: "user_login_error"
         * errorMessage: "User login is required."
         * name: "ClientAuthError"
         * type: "[MSAL API] Update Identity Claims Failure"
         */
        /*         this.subscription = this.broadcast.subscribe('msal:acquireTokenFailure', (payload) => {
                    this.store.dispatch(AppApiActions.updateIdentityClaimsFailure(payload.errorMessage));
                }); */
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

    destroy() {
        this.broadcast.getMSALSubject().next(1);
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
