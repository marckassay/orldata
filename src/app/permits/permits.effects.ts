import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AppApiActions } from '@app/core/actions';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { PaginatePermits, PermitsApiActions, PermitViewerActions, SearchPermitsActions } from '@permits/actions';
import * as fromPermits from '@permits/reducers';
import { combineLatest, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, take, tap } from 'rxjs/operators';
import { PermitsService, SearchRequest } from '../core/services/permits.service';

@Injectable()
export class PermitsEffects {

  constructor(
    private router: Router,
    private actions$: Actions,
    private service: PermitsService,
    private store: Store<fromPermits.State>
  ) { }

  /**
   * Side-effect is dispatch of: `AppApiActions.serviceActive` and `AppApiActions.serviceInactive`
   */
  search$ = createEffect(() => this.actions$.pipe(
    ofType(SearchPermitsActions.search, PermitViewerActions.getSelectedSearch, PaginatePermits.getSelectedPage),
    tap(() => this.store.dispatch(AppApiActions.serviceActive)),

    switchMap((action) => {
      if (action.type === PermitViewerActions.getSelectedSearch.type || action.type === PaginatePermits.getSelectedPage.type) {
        return combineLatest([this.store.select(fromPermits.getSearchLimit), this.store.select(fromPermits.getSearchSelectedState)]).pipe(
          take(1),
          map((s) => {
            return {
              selected: { selectedApplicationTypes: this.mapTo(s[1].selectedApplicationTypes) },
              pagination: { pageIndex: action.pageIndex, offset: action.pageIndex * s[0], limit: s[0] }
            } as SearchRequest;
          }),
        );
      } else {
        // TODO: remove following comments when issue upgraded to fixed build
        // https://github.com/ReactiveX/rxjs/issues/4723
        // tslint:disable-next-line: deprecation
        return of<SearchRequest>({
          selected: { selectedApplicationTypes: this.mapTo(action.selectedApplicationTypes) },
          pagination: undefined
        });
      }
    }),

    mergeMap((action) => this.service.search(action).pipe(
      map((results: {
        entities: object[];
        pagination: {
          pageIndex: number;
          count: number;
        }
      }) => {
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
      map((results: Array<{ application_type: string }>) => {
        this.store.dispatch(AppApiActions.serviceInactive);
        return PermitsApiActions.distinctApplicationTypes({ results });
      }),
    )),
    catchError((err) => {
      this.store.dispatch(AppApiActions.serviceInactive);
      return of(PermitsApiActions.searchFailure({ errorMsg: err }));
    }),
  ));

  // maps form group data to object literals
  // tslint:disable-next-line: max-line-length
  mapTo = (types: string[]): Array<{ application_type: string }> => {
    return types.map((value: string) => ({ application_type: value }));
  }
}
