import { Injectable } from '@angular/core';
import { CoreService } from '@app/app.service';
import { AppApiActions, CatalogActions } from '@core/actions';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

@Injectable()
export class CoreEffects {

  permitsMetadata$ = createEffect(() => this.actions$.pipe(
    ofType(CatalogActions.permitsDatasetStartup),
    mergeMap((action) => this.service.getPermitsMetadata().pipe(
      map((metadata: object[]) => AppApiActions.permitsMetadata({ metadata })),
    )),
    catchError(err =>
      of(AppApiActions.permitsMetadataFailure({ errorMsg: err }))
    )
  ));

  crimesMetadata$ = createEffect(() => this.actions$.pipe(
    ofType(CatalogActions.crimesDatasetStartup),
    mergeMap((action) => this.service.getCrimesMetadata().pipe(
      map((metadata: object[]) => AppApiActions.crimesMetadata({ metadata })),
    )),
    catchError(err =>
      of(AppApiActions.crimesMetadataFailure({ errorMsg: err }))
    )
  ));

  constructor(
    private actions$: Actions,
    private service: CoreService
  ) { }
}
