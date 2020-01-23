import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';

@Injectable()
export class NgrxMsalGuard extends MsalGuard {
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Promise<boolean> {
        return super.canActivate(route, state);
    }
}
