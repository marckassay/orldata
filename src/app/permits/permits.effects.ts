import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AppApiActions } from '@app/core/actions';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { PermitsApiActions, PermitViewerActions, SearchPermitsActions } from '@permits/actions';
import * as fromPermits from '@permits/reducers';
import { of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { PermitsService } from '../core/services/permits.service';

@Injectable()
export class PermitsEffects {

  /**
   * Side-effect is dispatch of: `AppApiActions.serviceActive` and `AppApiActions.serviceInactive`
   */
  search$ = createEffect(() => this.actions$.pipe(
    ofType(SearchPermitsActions.search),
    tap(() => this.store.dispatch(AppApiActions.serviceActive)),
    mergeMap((action) => this.service.search(action, action.offset).pipe(
      map((results) => {
        this.store.dispatch(AppApiActions.serviceInactive);
        return PermitsApiActions.searchSuccess(results);
      }),
    )),
    catchError((err) => {
      this.store.dispatch(AppApiActions.serviceInactive);
      return of(PermitsApiActions.searchFailure({ errorMsg: err }));
    }),
  ));

  /**
   * Queries for fields that are defined collections, specifically: `application_type` and `worktype`.
   */
  getSearchFormData$ = createEffect(() => this.actions$.pipe(
    ofType(PermitViewerActions.getSearchFormData),
    tap(() => this.store.dispatch(AppApiActions.serviceActive)),
    mergeMap(() => this.service.getDistinctApplicationTypes().pipe(
      map((results: Array<{application_type: string}>) => {
        this.store.dispatch(AppApiActions.serviceInactive);
        return PermitsApiActions.distinctApplicationTypes({ results });
      }),
    )),
    catchError((err) => {
      this.store.dispatch(AppApiActions.serviceInactive);
      return of(PermitsApiActions.searchFailure({ errorMsg: err }));
    }),
  ));

  constructor(
    private router: Router,
    private actions$: Actions,
    private service: PermitsService,
    private store: Store<fromPermits.State>
  ) { }
}
