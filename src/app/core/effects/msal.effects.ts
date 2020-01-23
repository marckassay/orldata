import { Injectable } from '@angular/core';
import * as fromCore from '@core/reducers';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, switchMap } from 'rxjs/operators';
import { AppApiActions } from '../actions';
import { MsalService } from '../services/msal.service';

@Injectable()
export class MsalEffects {

    constructor(
        private actions: Actions,
        private service: MsalService,
        private store: Store<fromCore.State>
    ) { }

    identityLogOut = createEffect(() => this.actions.pipe(
        ofType(AppApiActions.logoutClicked),
        switchMap(() => {
            this.service.logOut();

            return map(() => this.store.dispatch(AppApiActions.logoutIdentitySuccess()));
        })
    ));
}
