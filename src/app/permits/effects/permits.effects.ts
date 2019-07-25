import { Injectable } from '@angular/core';
import { AppApiActions } from '@app/core/actions';
import { PermitsService } from '@core/services/permits.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { PermitsApiActions, PermitsEffectActions, PermitsFormTabActions, PermitsTableTabActions } from '@permits/actions';
import { UpdateCountRequest, UpdateCountResponse, UpdateDistinctFilteredNamesResponse, UpdateEntitiesRequest, UpdateEntitiesResponse } from '@permits/effects/types';
import * as fromPermits from '@permits/reducers';
import { combineLatest, of } from 'rxjs';
import { catchError, filter, map, mergeMap, switchMap, take, tap } from 'rxjs/operators';

@Injectable()
export class PermitsEffects {

  constructor(
    private actions: Actions,
    private service: PermitsService,
    private store: Store<fromPermits.State>
  ) { }

  /**
   * Side-effect is dispatch of: `AppApiActions.serviceActive` and `AppApiActions.serviceInactive`
   */
  updateEntities = createEffect(() => this.actions.pipe(
    ofType(PermitsEffectActions.paginateToFirst, PermitsTableTabActions.paginate),
    tap(() => this.store.dispatch(AppApiActions.serviceActive)),

    switchMap((action) => {
      return combineLatest([
        this.store.select(fromPermits.getPageSize),
        this.store.select(fromPermits.getSelectedSearchState)]).pipe(
          take(1),
          map(([size, selected]) => {
            return {
              selected: {
                ...selected,
                selectedApplicationTypes: this.mapTo(selected.selectedApplicationTypes),
              },
              pagination: { pageIndex: action.pageIndex, offset: action.pageIndex * size, limit: size }
            } as UpdateEntitiesRequest;
          }),
        );
    }),

    mergeMap((request) => {
      return this.service.getEntities(request).pipe(
        tap(() => this.store.dispatch(AppApiActions.serviceInactive)),
        map((response: UpdateEntitiesResponse) => {
          return PermitsApiActions.updateEntitiesSuccess(response);
        }),
      );
    }),

    catchError((err) => {
      this.store.dispatch(AppApiActions.serviceInactive);
      return of(PermitsApiActions.updateEntitiesFailure({ errorMsg: err }));
    }),
  ));

  updateCount = createEffect(() => this.actions.pipe(
    ofType(PermitsFormTabActions.updateSelected),
    tap(() => this.store.dispatch(AppApiActions.serviceActive)),

    switchMap((action) => {
      return of<UpdateCountRequest>({
        selected: {
          ...action,
          selectedApplicationTypes: this.mapTo(action.selectedApplicationTypes),
        }
      });
    }),

    mergeMap((request) => {
      if (request.selected.selectedApplicationTypes.length !== 0) {

        return this.service.getCount(request).pipe(
          tap(() => this.store.dispatch(AppApiActions.serviceInactive)),
          /* TODO: this will be needed for typeahead feature
          tap(() => {
            this.checkSelectedFilterName(request);
          }),
          */
          map((response: UpdateCountResponse) => {
            return PermitsApiActions.updateCountSuccess(response);
          }),
        );

        // if no types are selected then by-pass `service` call
      } else {
        this.store.dispatch(AppApiActions.serviceInactive);

        return of(PermitsApiActions.updateCountSuccess({
          pagination: { pageIndex: 0 as const, count: 0 },
          lastResponseTime: Date.now()
        }));
      }
    }),

    catchError((err) => {
      this.store.dispatch(AppApiActions.serviceInactive);
      return of(PermitsApiActions.updateCountFailure({ errorMsg: err }));
    }),
  ));

  /**
   * Queries for fields that are defined collections, specifically: `application_type`.
   */
  updateDistincts = createEffect(() => this.actions.pipe(
    ofType(PermitsEffectActions.loadDistincts),
    tap(() => this.store.dispatch(AppApiActions.serviceActive)),

    mergeMap(() => this.service.getDistinctApplicationTypes().pipe(
      tap(() => this.store.dispatch(AppApiActions.serviceInactive)),
      map((results: Array<{ application_type: string }>) => {
        return PermitsApiActions.updateDistinctTypesSuccess({ results });
      }),
    )),

    catchError((err) => {
      this.store.dispatch(AppApiActions.serviceInactive);
      return of(PermitsApiActions.updateDistinctTypesFailure({ errorMsg: err }));
    }),
  ));

  updateDistinctFilteredNames = createEffect(() => this.actions.pipe(
    ofType(PermitsEffectActions.updateDistinctNames),
    tap(() => this.store.dispatch(AppApiActions.serviceActive)),

    mergeMap((action) => {
      // if its an empty string, this means to clear distinctFilteredNames
      if (action.selected.selectedFilterName.length > 0) {
        return this.service.getDistinctFilteredNames(action).pipe(
          tap(() => this.store.dispatch(AppApiActions.serviceInactive)),
          map((response: UpdateDistinctFilteredNamesResponse) => {
            return PermitsApiActions.updateDistinctNamesSuccess(response);
          })
        );
      } else {
        return of(PermitsApiActions.updateDistinctNamesSuccess({
          selectedFilterName: action.selected.selectedFilterName,
          distinctFilteredNames: [{}]
        }));
      }
    }),

    catchError((err) => {
      this.store.dispatch(AppApiActions.serviceInactive);
      return of(PermitsApiActions.updateDistinctNamesFailure({ errorMsg: err }));
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

  /**
   * If value is determined dirty and its a non-empty or empty string,
   * `PermitsApiActions.updateDistinctNamesSuccess()` will be dispatched to update the state.
   */
  private checkSelectedFilterName = (request: UpdateCountRequest) => {
    this.store.select(fromPermits.isSelectedFilterNameDirty(request.selected.selectedFilterName)).pipe(
      take(1),
      filter((val) => val === true),
      map(() => this.store.dispatch(PermitsEffectActions.updateDistinctNames(request)))
    );
  }
}
