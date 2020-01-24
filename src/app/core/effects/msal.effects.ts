import { Injectable } from '@angular/core';
import * as fromCore from '@core/reducers';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
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
        switchMap((): Observable<Action> => {
            // TODO: add check using this.service.msal.getLoginInProgress()
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
        switchMap(() => {
            this.service.logOut();

            return map(() => this.store.dispatch(AppApiActions.logoutIdentitySuccess()));
        }),
        catchError((err) => {
            return of(AppApiActions.logoutIdentityFailure({ errorMsg: err }));
        })
    ));
}
