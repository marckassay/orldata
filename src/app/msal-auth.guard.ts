import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import * as Azure from '@azure/msal-angular';
import * as fromCore from '@core/reducers';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { first, mapTo, tap } from 'rxjs/operators';
import { AppApiActions } from './core/actions';
import { DialogService } from './core/shared/account-dialog/dialog/dialog.service';

@Injectable({
    providedIn: 'root'
})
/**
 * @source https://angular.io/guide/router#resolve-pre-fetching-component-data
 */
export class MsalAuthGuard implements CanActivate {
    constructor(
        protected dialogService: DialogService,
        protected store: Store<fromCore.State>,
        private router: Router,
        private msal: Azure.MsalService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

        if (!this.msal.getAccount()) {

            this.router.navigate(['catalog']);
            this.dialogService.openDialog();

            return of(false);

        } else {

            const clientId = this.msal.getCurrentConfiguration().auth.clientId;

            return this.store.select(fromCore.getIdentity).pipe(
                first(),
                tap(() => {
                    this.store.dispatch(AppApiActions.catalogGuardTokenRequest({ scopes: [clientId] }));
                }),
                mapTo(true)
            );

        }
    }
}
