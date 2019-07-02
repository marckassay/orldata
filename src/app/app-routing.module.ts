import { Injectable, NgModule } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Resolve, Router, RouterModule, RouterStateSnapshot, Routes } from '@angular/router';
import * as fromCore from '@core/reducers';
import { Store } from '@ngrx/store';
import { merge, Observable } from 'rxjs';
import { filter, mapTo, scan, take } from 'rxjs/operators';

export interface CatalogResolverType { permits: boolean; crimes: boolean; }

@Injectable({
  providedIn: 'root'
})
/**
 * @source https://angular.io/guide/router#resolve-pre-fetching-component-data
 */
export class CatalogResolver implements Resolve<CatalogResolverType> {
  constructor(
    protected router: Router,
    protected route: ActivatedRoute,
    protected store: Store<fromCore.State>
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<CatalogResolverType> | Observable<never> {
    const seed: CatalogResolverType = { permits: false, crimes: false };

    return merge(
      this.store.select(fromCore.getPermitsMetadata).pipe(
        filter((value) => value !== undefined),
        mapTo({permits: true})
      ),
      this.store.select(fromCore.getCrimesMetadata).pipe(
        filter((value) => value !== undefined),
        mapTo({crimes: true})
      )
    ).pipe(
        scan((acc, curr) => Object.assign(seed, acc, curr), seed),
        filter((value: { permits: boolean, crimes: boolean }) => (value.permits === true && value.crimes === true)),
        take(1)
    );
  }
}

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: '@core/components/home/home.component#HomeModule',
    data: { title: 'Home' }
  },
  {
    path: 'catalog',
    loadChildren: '@core/components/catalog/catalog.component#CatalogModule',
    pathMatch: 'full',
    resolve: { subject: CatalogResolver },
    data: { title: 'Catalog' }
  },
  {
    path: 'catalog/permits',
    loadChildren: '@permits/permits.component#PermitsModule',
    data: { title: 'Permits' }
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      enableTracing: false, // <-- debugging purposes only
      relativeLinkResolution: 'corrected'
    })
  ],
  exports: [
    RouterModule
  ],
})
export class AppRoutingModule { }
