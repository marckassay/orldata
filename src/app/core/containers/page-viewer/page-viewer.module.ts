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
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Resolve, Router, RouterModule, RouterStateSnapshot, Routes, UrlTree } from '@angular/router';
import { CatalogItems } from '@app/core/components/catalog/catalog-items';
import { CheckboxGridModule } from '@app/core/shared/checkbox-grid/checkbox-grid.module';
import { NumericLimitPipe } from '@app/core/shared/numericlimit.pipe';
import * as fromRoot from '@app/reducers';
import { select, Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { catchError, filter, mapTo, scan, take } from 'rxjs/operators';
import { PageViewerActions } from './actions';
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
export class TableTabResolver implements Resolve<number> {
  selectRouter: any;

  constructor(
    protected router: Router,
    protected route: ActivatedRoute,
    protected store: Store<fromRoot.State>,
  ) {
    store.select(fromRoot.selectRouter).subscribe(value => this.selectRouter = value);
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<number> | Observable<never> {
    const page = this.selectRouter.state.root.firstChild.data.title.toLowerCase();
    this.store.dispatch(PageViewerActions.getSelectedSearch({ page }));

    // dispatch action above, and take 2 emissions in this stream; first prior to response of action
    // and second post from response
    return this.store.select(fromRoot.getSelectedLastResponseTime(page)).pipe(
      take(2),
      catchError(error => throwError(error))
    );
  }
}

export interface FormTabResolverType {
  applicationTypes: boolean;
}

@Injectable({
  providedIn: 'root'
})
/**
 * @source https://angular.io/guide/router#resolve-pre-fetching-component-data
 */
export class FormTabResolver implements Resolve<FormTabResolverType> {
  selectRouter: any;

  constructor(
    protected router: Router,
    protected route: ActivatedRoute,
    protected store: Store<fromRoot.State>,
  ) {
    store.select(fromRoot.selectRouter).subscribe(value => this.selectRouter = value);
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<FormTabResolverType> | Observable<never> {
    const seed: FormTabResolverType = { applicationTypes: false };

    const page = this.selectRouter.state.root.firstChild.data.title.toLowerCase();
    this.store.dispatch(PageViewerActions.getSelectedFormSearch({ page }));

    return this.store.select(fromRoot.getPredefinedData(page)).pipe(
      filter((value) => value !== undefined),
      mapTo({ applicationTypes: true })
    ).pipe(
      scan((acc, curr) => Object.assign(seed, acc, curr), seed),
      filter((value: FormTabResolverType) => (value.applicationTypes === true)),
      take(1)
    );
  }
}

@Injectable({
  providedIn: 'root',
})
class CanActivateTab implements CanActivate {
  selectUrl: string;
  selectRouter: any;

  constructor(
    public store: Store<fromRoot.State>,
    public router: Router,
    private activatedRoute: ActivatedRoute) {

    store.select(fromRoot.selectUrl).subscribe(value => this.selectUrl = value);
    store.select(fromRoot.selectRouter).subscribe(value => this.selectRouter = value);
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const page = this.selectRouter.state.root.firstChild.data.title.toLowerCase();

    /**
     * Converts for instance:
     *
     * `'/catalogs/permits/table'` to `'/catalogs/permits/form'`
     */
    const getRedirectLink = (): string[] => {
      let result;
      if (this.selectUrl && this.selectUrl.match('/')) {
        result = this.selectUrl.split('/');
        result.pop();
        result.push('form');
      }
      return result as string[];
    };

    let count = 0;
    this.store.pipe(
      select(fromRoot.getSelectedCount(page)),
      take(1),
    ).subscribe(value => count = value);

    return (count > 0) ? true : this.router.navigate(getRedirectLink(), { relativeTo: this.activatedRoute });
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
        pathMatch: 'full',
        resolve: { subject: FormTabResolver }
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
