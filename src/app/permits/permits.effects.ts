import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ContentName } from '@app/constants';
import { AppApiActions, PageViewerActions } from '@app/core/actions';
import { PermitsService } from '@core/services/permits.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { PermitsApiActions, PermitsEffectActions, PermitsFormTabActions, PermitsTableTabActions } from '@permits/actions';
import * as fromPermits from '@permits/reducers';
import { combineLatest, of } from 'rxjs';
import { catchError, filter, map, mergeMap, switchMap, take, tap } from 'rxjs/operators';

export interface SearchRequest {
  selected: { selectedApplicationTypes: Array<{ application_type: string }> };
  pagination?: {
    pageIndex: number;
    offset: number;
    limit: number;
  };
}

export interface SearchResponse {
  /**
   * The collection to be rendered in `Table-Tab`. This is `undefined` when query is to get the count.
   */
  entities?: object[];
  pagination: {
    pageIndex?: number;
    count?: number;
  };
  lastResponseTime: number;
}

@Injectable()
export class PermitsEffects {

  constructor(
    private router: Router,
    private actions$: Actions,
    private service: PermitsService,
    private store: Store<fromPermits.State>
  ) { }

  /**
   * When `PageViewerModule` resolves routes generically, it dispatches `PageViewerActions` with a
   * prop of `page`. If `page` is this effects concern, then this stream will "redirect" action.
   */
  redirectPaginateToFirst$ = createEffect(() => this.actions$.pipe(
    ofType(PageViewerActions.preloadEntities),
    filter((action) => action.content === ContentName.Permits),
    map(() => PermitsEffectActions.paginateToFirst())
  ));

  /**
   * Side-effect is dispatch of: `AppApiActions.serviceActive` and `AppApiActions.serviceInactive`
   */
  updateEntities$ = createEffect(() => this.actions$.pipe(
    ofType(PermitsEffectActions.paginateToFirst, PermitsTableTabActions.paginate),
    tap(() => this.store.dispatch(AppApiActions.serviceActive)),

    switchMap((action) => {
      return combineLatest([this.store.select(fromPermits.getPageSize), this.store.select(fromPermits.getSelectedSearchState)]).pipe(
        take(1),
        map(([size, selected]) => {
          return {
            selected: { selectedApplicationTypes: this.mapTo(selected.selectedApplicationTypes) },
            pagination: { pageIndex: action.pageIndex, offset: action.pageIndex * size, limit: size }
          } as SearchRequest;
        }),
      );
    }),

    mergeMap((request) => {
      return this.service.search(request).pipe(
        map((response: SearchResponse) => {
          this.store.dispatch(AppApiActions.serviceInactive);
          return PermitsApiActions.querySuccess(response);
        }),
      );
    }),

    catchError((err) => {
      this.store.dispatch(AppApiActions.serviceInactive);
      return of(PermitsApiActions.queryFailure({ errorMsg: err }));
    }),
  ));

  updateCount$ = createEffect(() => this.actions$.pipe(
    ofType(PermitsFormTabActions.updateSelected),
    tap(() => this.store.dispatch(AppApiActions.serviceActive)),

    switchMap((action) => {
      // TODO: remove following comments when issue upgraded to fixed build
      // https://github.com/ReactiveX/rxjs/issues/4723
      return of<SearchRequest>({
        selected: { selectedApplicationTypes: this.mapTo(action.selectedApplicationTypes) },
        pagination: undefined
      });
    }),

    mergeMap((request) => {
      if (request.selected.selectedApplicationTypes.length !== 0) {
        return this.service.search(request).pipe(
          map((response: SearchResponse) => {
            this.store.dispatch(AppApiActions.serviceInactive);
            return PermitsApiActions.querySuccess(response);
          }),
        );
        // if no types are selected then by-pass `service` call
      } else {
        this.store.dispatch(AppApiActions.serviceInactive);

        return of(PermitsApiActions.querySuccess({
          entities: undefined,
          pagination: { count: 0 },
          lastResponseTime: Date.now()
        }));
      }
    }),

    catchError((err) => {
      this.store.dispatch(AppApiActions.serviceInactive);
      return of(PermitsApiActions.queryFailure({ errorMsg: err }));
    }),
  ));

  /**
   * Redirects an action (`PageViewerActions.preloadDistincts`) from `PageViewer` to a content
   * specific action; `PermitsEffectActions.loadDistincts`.
   */
  redirectToLoadDistincts$ = createEffect(() => this.actions$.pipe(
    ofType(PageViewerActions.preloadDistincts),
    filter((action) => action.content === ContentName.Permits),
    map(() => PermitsEffectActions.loadDistincts())
  ));

  /**
   * Queries for fields that are defined collections, specifically: `application_type` and `worktype`.
   */
  loadDistincts$ = createEffect(() => this.actions$.pipe(
    ofType(PermitsEffectActions.loadDistincts),
    tap(() => this.store.dispatch(AppApiActions.serviceActive)),

    mergeMap(() => this.service.getDistinctApplicationTypes().pipe(
      map((results: Array<{ application_type: string }>) => {
        this.store.dispatch(AppApiActions.serviceInactive);
        return PermitsApiActions.distinctApplicationTypes({ results });
      }),
    )),

    catchError((err) => {
      this.store.dispatch(AppApiActions.serviceInactive);
      return of(PermitsApiActions.queryFailure({ errorMsg: err }));
    }),
  ));

  // maps form group data to object literals
  private mapTo = (types: string[] | undefined): Array<{ application_type: string }> | never => {
    if (typeof types !== 'undefined') {
      return types.map((value: string) => ({ application_type: value }));
    } else {
      throw new Error(`Parameter 'types', unconditionally was expected to have a value with route
       guards enforcing it. Did a route guard get modified?`);
    }
  }
}
