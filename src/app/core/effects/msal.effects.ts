import { Injectable } from '@angular/core';
import * as fromCore from '@core/reducers';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';
import { AppApiActions } from '../actions';
import { MsalService } from '../services/msal.service';

@Injectable()
export class MsalEffects {

    constructor(
        private actions: Actions,
        private service: MsalService,
        private store: Store<fromCore.State>
    ) { }

    identityLogIn = createEffect(() => this.actions.pipe(
        ofType(AppApiActions.loginClicked),
        filter(() => this.service.isLoginInProgress() === false),
        switchMap((): Observable<Action> => {
            return this.service.logIn().pipe(
                map(value => AppApiActions.loginIdentitySuccess(value))
            );
        }),
        catchError((err) => {
            return of(AppApiActions.loginIdentityFailure({ errorMsg: err }));
        })
    ));

    identityLogOut = createEffect(() => this.actions.pipe(
        ofType(AppApiActions.logoutClicked),
        switchMap((): Observable<Action> => {
            return this.service.logOut().pipe(
                map(() => AppApiActions.logoutIdentitySuccess())
            );
        }),
        catchError((err) => {
            return of(AppApiActions.logoutIdentityFailure({ errorMsg: err }));
        })
    ));

    // since Msal, does its own broadcasting, orldata just invoke its API
    guardTokenRequest = createEffect(() => this.actions.pipe(
        ofType(AppApiActions.catalogGuardTokenRequest),
        map((value): Observable<boolean> => {
            return this.service.acquireTokenSilent(value);
        })
    ), { dispatch: false });
}
