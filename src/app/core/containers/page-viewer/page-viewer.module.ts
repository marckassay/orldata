import { CommonModule } from '@angular/common';
import { Injectable, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
// tslint:disable-next-line: max-line-length
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Resolve, Router, RouterModule, RouterStateSnapshot, Routes, UrlTree } from '@angular/router';
import { CatalogItems } from '@app/core/components/catalog/catalog-items';
import { CheckboxGridModule } from '@app/core/shared/checkbox-grid/checkbox-grid.module';
import { NumericLimitPipe } from '@app/core/shared/numericlimit.pipe';
import { Actions } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { PermitViewerActions } from '@permits/actions';
import * as fromPermits from '@permits/reducers';
import { Observable, throwError } from 'rxjs';
import { catchError, delay, map, switchMap, take } from 'rxjs/operators';
import { FormTabComponent } from './form-tab/form-tab.component';
import { OptionsTabComponent } from './options-tab/options-tab.component';
import { PageViewerComponent } from './page-viewer.component';
import { TableTabComponent } from './table-tab/table-tab.component';

@Injectable({
  providedIn: 'root'
})
/**
 * @source https://angular.io/guide/router#resolve-pre-fetching-component-data
 */
export class TableTabResolver implements Resolve<any> {
  constructor(
    protected router: Router,
    private actions$: Actions,
    protected route: ActivatedRoute,
    protected store: Store<fromPermits.State>
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.store.select(fromPermits.getPermitSelectedState).pipe(
      take(1),
      map(selectedState =>
        this.store.dispatch(PermitViewerActions.getSelectedSearch({...selectedState, offset: 0})),
      ),
      switchMap(() =>
        this.store.select(fromPermits.getPermitEntitiesState).pipe(
          // TODO: issue attempting to resolve when skip is used instead of take
          // this delay is a hack, but works as desired *if* the service call takes just as long as
          // this delay call is set to.
          delay(2000),
          take(1),
          // skip(1)
        )
      ),
      catchError(error => throwError(error))
    );
  }
}

@Injectable({
  providedIn: 'root',
})
class CanActivateTab implements CanActivate {

  count: number;

  constructor(public store: Store<fromPermits.State>, public router: Router, private activatedRoute: ActivatedRoute) {
    this.store.pipe(
      select(fromPermits.getCount)
    ).subscribe(count => this.count = count);
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    // src: https://stackoverflow.com/a/49822971/648789
    const redirectTo = route.pathFromRoot
      .filter(p => p !== route && p.url !== null && p.url.length > 0)
      .reduce((arr, p) => arr.concat(p.url.map(u => u.path)), new Array<string>());

    return (this.count > 0) ? true : this.router.navigate(redirectTo.concat('form'), { relativeTo: this.activatedRoute });
  }
}


export const routes: Routes = [
  {
    path: '',
    component: PageViewerComponent,
    children: [
      {
        path: '',
        redirectTo: 'table',
        pathMatch: 'full'
      },
      {
        path: 'table',
        component: TableTabComponent,
        pathMatch: 'full',
        canActivate: [CanActivateTab],
        resolve: { subject: TableTabResolver }
      },
      {
        path: 'form',
        component: FormTabComponent,
        pathMatch: 'full'
      },
      // { path: 'options', component: OptionsTabComponent, pathMatch: 'full', redirectTo: 'table' },
      {
        path: '**',
        redirectTo: 'table'
      }
    ],
  }
];

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatBadgeModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSelectModule,
    MatCardModule,
    MatGridListModule,
    MatCheckboxModule,
    MatFormFieldModule,
    CheckboxGridModule,
    RouterModule.forChild(routes),
    CommonModule,
  ],
  exports: [
    PageViewerComponent,
  ],
  declarations: [
    NumericLimitPipe,
    PageViewerComponent,
    TableTabComponent,
    FormTabComponent,
    OptionsTabComponent
  ],
  providers: [
    CanActivateTab,
    CatalogItems
  ]
})
export class PageViewerModule { }
