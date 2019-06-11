import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { CoreService } from '@app/app.service';
import * as fromCore from '@core/reducers';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { RouterNavigationAction, ROUTER_NAVIGATION } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, filter, map, mergeMap, switchMap, take, tap, withLatestFrom } from 'rxjs/operators';
import { AppApiActions } from '../actions';


@Injectable()
export class RouterEffects {

  /*
    This works for now, althought I'm not sure what to make out of it. Resources are gathered from
    these two links:
    https://dev.to/jonrimmer/where-to-initiate-data-load-in-ngrx-358l
    https://github.com/ngrx/platform/issues/467
  */
  prefetchCatalogMetadata$ = createEffect(() => this.actions$.pipe(
    ofType<RouterNavigationAction>(ROUTER_NAVIGATION),
    withLatestFrom(this.store.select(fromCore.getPermitsMetadata)),
    filter(([action, loaded]) =>
      action.payload.routerState.url.includes('/catalog') && !loaded
    ),
    take(1),
    tap(() => console.log('[RouterEffects] Prefetching permit data for catalog page.')),
    switchMap(() => {
      return this.service.getPermitsMetadata().pipe(
        map((metadata: object[]) => AppApiActions.permitsMetadata({ metadata })),
        catchError(err =>
          of(AppApiActions.permitsMetadataFailure({ errorMsg: err }))
        )
      );
    })
  ));

  updateTitle$ = createEffect(
    () =>
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => {
          let route = this.activatedRoute;
          while (route.firstChild) { route = route.firstChild; }
          return route;
        }),
        mergeMap(route => route.data),
        // TODO: add subtitle when and if rows can expand for detail
        // map(data => `Permits - ${data.title}`),
        map(data => (data.title) ? data.title : ''),
        tap(title => (title) ? this.titleService.setTitle(title) : '')
      ),
    {
      dispatch: false,
    }
  );

  constructor(
    private router: Router,
    private titleService: Title,
    private activatedRoute: ActivatedRoute,
    private actions$: Actions,
    private service: CoreService,
    private store: Store<fromCore.State>
  ) { }
}
