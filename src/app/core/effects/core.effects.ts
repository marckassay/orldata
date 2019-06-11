import { Injectable } from '@angular/core';
import { CoreService } from '@app/app.service';
import { CatalogActions, CatalogApiActions } from '@core/actions';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

@Injectable()
export class CoreEffects {

  lastModified$ = createEffect(() => this.actions$.pipe(
    ofType(CatalogActions.requestForLastModifiedDate),
    mergeMap((action) => this.service.getLastModifiedDate().pipe(
      map((header: object[]) => CatalogApiActions.lastModifiedResponse({ header })),
    )),
    catchError(err =>
      of(CatalogApiActions.lastModifiedFailure({ errorMsg: err }))
    )
  ));

  constructor(
    private actions$: Actions,
    private service: CoreService
  ) { }
}
