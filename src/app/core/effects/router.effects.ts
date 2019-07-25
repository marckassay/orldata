import { Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { CrimesService } from '@app/core/services/crimes.service';
import { PermitsService } from '@app/core/services/permits.service';
import * as fromCore from '@core/reducers';
import { createEffect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, filter, map, switchMap, take, tap, withLatestFrom } from 'rxjs/operators';
import { AppApiActions } from '../actions';

@Injectable()
export class RouterEffects {

  /**
   * Prefetches metadata on datasets to retrieve last updated, description, name, etc values.
   * Although this does retrieve and startup the progress-bar immediately, it *doesn't* halt Angular's
   * routing until its completed. Not sure if that is possible or not.
   *
   * This works for now, althought I'm not sure what to make out of it. Resources are gathered from
   * the 1st and 2nd links (listed below). The 3rd link, discusses about an Angular limitation
   * (UI rendering during active routing) which seems to not apply IF acted during the NavigationStart
   * event. So the current form of these 2 prefetch effects are from that information. See the 3rd
   * link.
   * - https://dev.to/jonrimmer/where-to-initiate-data-load-in-ngrx-358l
   * - https://github.com/ngrx/platform/issues/467
   * - https://stackoverflow.com/questions/37069609/show-loading-screen-when-navigating-between-routes-in-angular-2
   */
  prefetchPermitsMetadata = createEffect(() => this.router.events.pipe(
    filter(event => event instanceof NavigationStart),
    filter(event => (event as NavigationStart).url.includes('/catalog')),
    withLatestFrom(this.store.select(fromCore.getPermitsMetadata)),
    take(1),
    tap(() => console.log(`[RouterEffects - Resolve] Crime's metadata for Catalog page.`)),
    tap(() => this.store.dispatch(AppApiActions.serviceActive)),
    switchMap(() => this.permitsSvc.getMetadata().pipe(
      map((metadata: object[]) =>
        AppApiActions.permitsMetadata({ metadata })),
      catchError(err =>
        of(AppApiActions.permitsMetadataFailure({ errorMsg: err }))
      )
    )
    ),
    tap(() => console.log(`[RouterEffects - Resolved] Crime's metadata.`)),
    tap(() => this.store.dispatch(AppApiActions.serviceInactive))
  ));

  prefetchCrimesMetadata = createEffect(() => this.router.events.pipe(
    filter(event => event instanceof NavigationStart),
    filter(event => (event as NavigationStart).url.includes('/catalog')),
    withLatestFrom(this.store.select(fromCore.getCrimesMetadata)),
    take(1),
    tap(() => console.log(`[RouterEffects - Resolve] Crime's metadata for Catalog page.`)),
    tap(() => { this.store.dispatch(AppApiActions.serviceActive); }),
    switchMap(() => this.crimesSvc.getMetadata().pipe(
      map((metadata: object[]) => AppApiActions.crimesMetadata({ metadata })),
      catchError(err =>
        of(AppApiActions.crimesMetadataFailure({ errorMsg: err }))
      )
    )
    ),
    tap(() => console.log(`[RouterEffects - Resolved] Crime's metadata.`)),
    tap(() => { this.store.dispatch(AppApiActions.serviceInactive); })
  ));

  constructor(
    private router: Router,
    private permitsSvc: PermitsService,
    private crimesSvc: CrimesService,
    private store: Store<fromCore.State>
  ) { }
}
