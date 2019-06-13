import { Injectable } from '@angular/core';
import { AppApiActions, RouterActions } from '@app/core/actions';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { PermitsService } from '../core/services/permits.service';
import { PermitsApiActions, SearchPermitsActions } from './actions';

@Injectable()
export class PermitsEffects {

  search$ = createEffect(() => this.actions$.pipe(
    ofType(SearchPermitsActions.search),
    mergeMap((action) => this.service.search(action.payload.query, action.payload.offset).pipe(
      map((results) => PermitsApiActions.searchSuccess({ results })),
    )),
    catchError(err =>
      of(PermitsApiActions.searchFailure({ errorMsg: err }))
    )
  ));

  metadata$ = createEffect(() => this.actions$.pipe(
    ofType(RouterActions.permitsDatasetStartup),
    mergeMap(() => this.service.getMetadata().pipe(
      map((metadata: object[]) => AppApiActions.permitsMetadata({ metadata })),
    )),
    catchError(err =>
      of(AppApiActions.permitsMetadataFailure({ errorMsg: err }))
    )
  ));

  constructor(
    private actions$: Actions,
    private service: PermitsService
  ) { }
}
