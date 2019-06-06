import { Injectable } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { asyncScheduler, EMPTY, of } from 'rxjs';
import { catchError, debounceTime, map, skip, switchMap, takeUntil } from 'rxjs/operators';
import { PermitsApiActions } from '.';
import { searchFilteredPermits } from './permit.actions';
import { PermitService } from './permit.services';


@Injectable()
export class PermitEffects {
  search$ = createEffect(
    () => ({ debounce = 1000, scheduler = asyncScheduler } = {}) =>
      this.actions$.pipe(
        ofType(searchFilteredPermits.type),
        debounceTime(debounce, scheduler),
        switchMap(({ filter }) => {
          if (filter === '') {
            return EMPTY;
          }

          const nextSearch$ = this.actions$.pipe(
            ofType(searchFilteredPermits.type),
            skip(1)
          );

          return this.service.getRecentPermits(filter, offset).pipe(
            takeUntil(nextSearch$),
            map((permits: object[]) => PermitsApiActions.searchSuccess({ permits })),
            catchError(err =>
              of(PermitsApiActions.searchFailure({ errorMsg: err }))
            )
          );
        })
      )
  );

/*   applicationTypes$ = createEffect(

  )
   */
  constructor(
    private actions$: Actions,
    private service: PermitService
  ) { }
}
