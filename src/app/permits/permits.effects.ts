import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { PermitsApiActions, SearchPermitsActions } from './actions';
import { PermitsService } from './permits.services';

@Injectable()
export class PermitsEffects {

  search$ = createEffect(() => this.actions$.pipe(
    ofType(SearchPermitsActions.queryPermits),
    mergeMap((action) => this.service.getRecentPermits(action.payload.query, action.payload.offset).pipe(
      map((results) => PermitsApiActions.searchSuccess({ results })),
    )),
    catchError(err =>
      of(PermitsApiActions.searchFailure({ errorMsg: err }))
    )
  ));

  constructor(
    private actions$: Actions,
    private service: PermitsService
  ) { }
}
