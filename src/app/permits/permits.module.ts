import { ObserversModule } from '@angular/cdk/observers';
import { Injectable, NgModule } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Resolve, Router, RouterModule, RouterStateSnapshot, UrlTree } from '@angular/router';
import { CanActivateTab, FormTabResolver, PageViewerModule, TableTabResolver } from '@app/core/containers/page-viewer/page-viewer.module';
import * as fromRoot from '@app/reducers';
import { COUNT_TOKEN } from '@core/containers/page-viewer/page-viewer.component';
import { ContentName } from '@core/shared/constants';
import { EffectsModule } from '@ngrx/effects';
import { select, Store, StoreModule } from '@ngrx/store';
import { PermitsEffects } from '@permits/effects/permits.effects';
import * as fromPermits from '@permits/reducers';
import { reducers } from '@permits/reducers';
import { Observable, of } from 'rxjs';
import { filter, mapTo, pairwise, scan, skipWhile, startWith, switchMap, take, tap } from 'rxjs/operators';
import { PermitsEffectActions } from './actions';
import { PermitsComponent } from './permits.component';
import { PermitsFormTabComponent } from './views/form-tab/form-tab.component';
import { PermitsTableTabComponent } from './views/table-tab/table-tab.component';

@Injectable({
  providedIn: 'root'
})
export class PermitsTableTabResolver extends TableTabResolver<boolean> implements Resolve<boolean> {

  isFirstTableVisit: boolean;

  constructor(
    protected store: Store<fromPermits.State>,
  ) {
    super();
    this.isFirstTableVisit = true;
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

    /**
     * Dispatches `paginateToFirst` action, switches to inner observable and observes getDirtyStatus
     * for a change to `true`.
     */
    return of(this.store.dispatch(PermitsEffectActions.paginateToFirst())).pipe(

      switchMap(() => {
        if (this.isFirstTableVisit === true) {
          this.isFirstTableVisit = false;

          return this.store.select(fromPermits.getLastResponseTime).pipe(
            startWith(0),
            pairwise(),
            filter(value => value.every((time) => time > 0)),
            take(1)
          ).pipe(
            mapTo(true)
          );

        } else {

          return this.store.select(fromPermits.getDirtyStatus).pipe(
            skipWhile(value => value === true),
            take(1),
            mapTo(true)
          );

        }
      })

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
    const getRedirectLink = (): Array<string> => {
      let result;
      if (this.selectUrl && this.selectUrl.match('/')) {
        result = this.selectUrl.split('/');
        result.pop();
        result.push('form');
        result = result.filter((links) => links.length > 0);
      } else {
        console.error('Expected redirect link but got this:', this.selectUrl);
      }

      return result as Array<string>;
    };

    let count = 0;
    this.store.pipe(
      select(fromPermits.getCount),
      take(1),
    ).subscribe(value => count = value);

    return (count > 0) ? true : this.router.navigate(getRedirectLink(), { relativeTo: this.activatedRoute });
  }
}

// TODO: this should be 'providedIn' this module (or PageViewerModule)?
@Injectable({ providedIn: 'root' })
export class PermitsCountService {

  private observable: Observable<number>;

  toObservable(): Observable<number> {
    return this.observable;
  }

  constructor(protected store: Store<fromPermits.State>) {
    this.observable = store.pipe(select(fromPermits.getCount), startWith(0));
  }
}

@NgModule({
  imports: [
    ObserversModule,
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
    PageViewerModule,
    RouterModule.forChild([{
      path: '',
      component: PermitsComponent,
      children: [
        {
          path: 'table',
          component: PermitsTableTabComponent,
          pathMatch: 'full',
          canActivate: [CanActivateTab],
          resolve: { subject: TableTabResolver }
        },
        {
          path: 'form',
          component: PermitsFormTabComponent,
          pathMatch: 'full',
          resolve: { subject: FormTabResolver }
        },
        {
          path: '',
          redirectTo: 'table',
        },
        {
          path: '**',
          redirectTo: 'table'
        }
      ],
    }]),
  ],
  providers: [
    PermitsTableTabResolver, { provide: TableTabResolver, useExisting: PermitsTableTabResolver },
    PermitsFormTabResolver, { provide: FormTabResolver, useExisting: PermitsFormTabResolver },
    PermitsCanActivateTableTab, { provide: CanActivateTab, useExisting: PermitsCanActivateTableTab },
    {
      provide: COUNT_TOKEN,
      useFactory: (svc: PermitsCountService) => svc.toObservable(),
      deps: [PermitsCountService]
    }
  ],
  exports: [
    PermitsComponent
  ],
  declarations: [
    PermitsTableTabComponent,
    PermitsFormTabComponent,
    PermitsComponent
  ]
})
export class PermitsModule { }
