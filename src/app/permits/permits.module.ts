import { Injectable, NgModule } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Resolve, Router, RouterModule, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ContentName } from '@app/constants';
import { CanActivateTab, FormTabResolver, TableTabResolver } from '@app/core/containers/page-viewer/page-viewer.module';
import * as fromRoot from '@app/reducers';
import { EffectsModule } from '@ngrx/effects';
import { select, Store, StoreModule } from '@ngrx/store';
import { PermitsEffects } from '@permits/permits.effects';
import * as fromPermits from '@permits/reducers';
import { reducers } from '@permits/reducers';
import { Observable, throwError } from 'rxjs';
import { catchError, filter, mapTo, scan, take, tap } from 'rxjs/operators';
import { PermitsEffectActions } from './actions';
import { PermitsComponent } from './permits.component';

@Injectable({
  providedIn: 'root'
})
export class PermitsTableTabResolver extends TableTabResolver implements Resolve<number> {

  constructor(
    protected store: Store<fromPermits.State>,
  ) { super(); }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<number> | Observable<never> {
    // take 2 emissions in this stream; first one is from prior to this resolve() being called
    // and second is post from dispatching `PageViewerActions.preloadEntities`
    return this.store.select(fromPermits.getLastResponseTime).pipe(
      tap(() =>
        this.store.dispatch(PermitsEffectActions.paginateToFirst())
      ),
      take(2),
      catchError(error => throwError(error))
    );
  }
}

export interface FormTabResolverType {
  applicationTypes: boolean;
}

@Injectable({
  providedIn: 'root'
})
/**
 * @source https://angular.io/guide/router#resolve-pre-fetching-component-data
 */
export class PermitsFormTabResolver extends FormTabResolver<FormTabResolverType> {

  constructor(
    protected store: Store<fromPermits.State>,
  ) { super(); }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<FormTabResolverType> | Observable<never> {
    const seed: FormTabResolverType = { applicationTypes: false };

    return this.store.select(fromPermits.getDistinctApplicationTypes).pipe(
      tap((value) =>
        (typeof value === 'undefined') ?
          this.store.dispatch(PermitsEffectActions.loadDistincts()) : value
      ),
      filter((value) => (typeof value !== 'undefined')),
      mapTo({ applicationTypes: true })
    ).pipe(
      scan((acc, curr) => Object.assign(seed, acc, curr), seed),
      filter((value: FormTabResolverType) => (value.applicationTypes === true)),
      take(1)
    );
  }
}

@Injectable({
  providedIn: 'root',
})
export class PermitsCanActivateTableTab extends CanActivateTab {

  selectUrl: string;
  selectRouter: any;

  constructor(
    public store: Store<fromPermits.State>,
    public router: Router,
    private activatedRoute: ActivatedRoute) {

    super();
    store.select(fromRoot.selectUrl).subscribe(value => this.selectUrl = value);
    store.select(fromRoot.selectRouter).subscribe(value => this.selectRouter = value);
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    /**
     * Converts the following route below, if table doesn't have a `count` greater than 0.
     *
     * `'/catalogs/permits/table'` to `'/catalogs/permits/form'`
     */
    const getRedirectLink = (): string[] => {
      let result;
      if (this.selectUrl && this.selectUrl.match('/')) {
        result = this.selectUrl.split('/');
        result.pop();
        result.push('form');
        result = result.filter((links) => links.length > 0);
      } else {
        console.error('Expected redirect link but got this:', this.selectUrl);
      }
      return result as string[];
    };

    let count = 0;
    this.store.pipe(
      select(fromPermits.getCount),
      take(1),
    ).subscribe(value => count = value);

    return (count > 0) ? true : this.router.navigate(getRedirectLink(), { relativeTo: this.activatedRoute });
  }
}

@NgModule({
  imports: [

    /**
     * StoreModule.forFeature is used for composing state
     * from feature modules. These modules can be loaded
     * eagerly or lazily and will be dynamically added to
     * the existing state.
     */
    StoreModule.forFeature(ContentName.Permits, reducers),

    /**
     * Effects.forFeature is used to register effects
     * from feature modules. Effects can be loaded
     * eagerly or lazily and will be started immediately.
     *
     * All Effects will only be instantiated once regardless of
     * whether they are registered once or multiple times.
     */
    EffectsModule.forFeature([PermitsEffects]),

    RouterModule.forChild([
      {
        path: '',
        component: PermitsComponent,
        loadChildren: '@core/containers/page-viewer/page-viewer.module#PageViewerModule'
      }
    ]),
  ],
  providers: [
    PermitsTableTabResolver, { provide: TableTabResolver, useExisting: PermitsTableTabResolver },
    PermitsFormTabResolver, { provide: FormTabResolver, useExisting: PermitsFormTabResolver },
    PermitsCanActivateTableTab, { provide: CanActivateTab, useExisting: PermitsCanActivateTableTab },
  ],
  exports: [
    PermitsComponent
  ],
  declarations: [
    PermitsComponent
  ]
})
export class PermitsModule { }
