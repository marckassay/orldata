import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { CrimesService } from '@app/core/services/crimes.service';
import { PermitsService } from '@app/core/services/permits.service';
import * as fromCore from '@core/reducers';
import { Actions, createEffect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, filter, map, switchMap, take, tap, withLatestFrom } from 'rxjs/operators';
import { AppApiActions } from '../actions';


@Injectable()
export class RouterEffects {

  /**
   * This works for now, althought I'm not sure what to make out of it. Resources are gathered from
   * the 1st and 2nd links (listed below). The 3rd link, discusses about an Angular limitation
   * (UI rendering during active routing) which seems to not apply IF acted during the NavigationStart
   * event. So the current form of these 2 prefetch effects are from that information. See the 3rd
   * link.
   * - https://dev.to/jonrimmer/where-to-initiate-data-load-in-ngrx-358l
   * - https://github.com/ngrx/platform/issues/467
   * - https://stackoverflow.com/questions/37069609/show-loading-screen-when-navigating-between-routes-in-angular-2
   */
  prefetchPermitsMetadata$ = createEffect(() => this.router.events.pipe(
    filter(event => event instanceof NavigationStart),
    filter(event => (event as NavigationStart).url.includes('/catalog')),
    withLatestFrom(this.store.select(fromCore.getPermitsMetadata)),
    take(1),
    tap(() => { this.store.dispatch(AppApiActions.serviceCurrentlyCommunicating); }),
    tap(() => console.log('[RouterEffects] Prefetching Permits metadata for Catalog page.')),
    switchMap(() => this.permitsSvc.getMetadata().pipe(
        map((metadata: object[]) => AppApiActions.permitsMetadata({ metadata })),
        catchError(err =>
          of(AppApiActions.permitsMetadataFailure({ errorMsg: err }))
        )
      )
    ),
    tap(() => console.log('[RouterEffects] Prefetched Permits metadata.')),
    tap(() => { this.store.dispatch(AppApiActions.serviceCurrentlyCompleted); })
  ));

  prefetchCrimesMetadata$ = createEffect(() => this.router.events.pipe(
    filter(event => event instanceof NavigationStart),
    filter(event => (event as NavigationStart).url.includes('/catalog')),
    withLatestFrom(this.store.select(fromCore.getCrimesMetadata)),
    take(1),
    tap(() => { this.store.dispatch(AppApiActions.serviceCurrentlyCommunicating); }),
    tap(() => console.log('[RouterEffects] Prefetching Crimes metadata for Catalog page.')),
    switchMap(() => this.crimesSvc.getMetadata().pipe(
      map((metadata: object[]) => AppApiActions.crimesMetadata({ metadata })),
      catchError(err =>
        of(AppApiActions.crimesMetadataFailure({ errorMsg: err }))
      )
    )
    ),
    tap(() => console.log('[RouterEffects] Prefetched Crimes metadata.')),
    tap(() => { this.store.dispatch(AppApiActions.serviceCurrentlyCompleted); })
  ));

  updateTitle$ = createEffect(() => this.router.events.pipe(
        filter(event => event instanceof NavigationStart),
        /*
        map(() => {
          let route = this.activatedRoute;
          while (route.firstChild) { route = route.firstChild; }
          return route;
        }),
        mergeMap(route => route.data),
        // TODO: add subtitle when and if rows can expand for detail
        // map(data => `Permits - ${data.title}`),
        map(data => (data.title) ? data.title : ''),
        tap(title => (title) ? this.titleService.setTitle(title) : '') */
      ), { dispatch: false });

  constructor(
    private router: Router,
    private titleService: Title,
    private activatedRoute: ActivatedRoute,
    private actions$: Actions,
    private permitsSvc: PermitsService,
    private crimesSvc: CrimesService,
    private store: Store<fromCore.State>
  ) { }
}
