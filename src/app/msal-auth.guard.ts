import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import * as fromCore from '@core/reducers';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';
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
        private router: Router
    ) { }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean {

        let isLoggedIn = false;
        this.store.select(fromCore.getIdentity).pipe(
            take(1),
            map(value => value.idp.length > 0),
        ).subscribe((value) => {
            isLoggedIn = value;
        });

        if (isLoggedIn === false) {
            // arrived using a hard-link that is deeper than catalog, issues arises; so since we now know they are not signed-on
            // navigate to a non-guarded route.
            this.router.navigate(['catalog']);
            this.dialogService.openDialog();
        }

        return isLoggedIn;
    }
}
