import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
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
import { ActivatedRouteSnapshot, CanActivate, Resolve, RouterModule, RouterStateSnapshot, Routes, UrlTree } from '@angular/router';
import { CatalogItems } from '@app/core/components/catalog/catalog-items';
import { CheckboxGridModule } from '@app/core/shared/checkbox-grid/checkbox-grid.module';
import { NumericLimitPipe } from '@app/core/shared/numericlimit.pipe';
import { Observable, throwError } from 'rxjs';
import { FormTabComponent } from './form-tab/form-tab.component';
import { PageViewerComponent } from './page-viewer.component';
import { TableTabComponent } from './table-tab/table-tab.component';

/**
 * @source https://angular.io/guide/router#resolve-pre-fetching-component-data
 */
export abstract class TableTabResolver implements Resolve<number> {
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<number> | Observable<never> {
    return throwError(`PageViewerModule's TableTabResolver() is abstract. It must be extended.`);
  }
}

export abstract class FormTabResolver<T> implements Resolve<T> {
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<T> | Observable<never> {
    return throwError(`PageViewerModule's FormTabResolver<T>() is abstract. It must be extended.`);
  }
}

export abstract class CanActivateTab implements CanActivate {
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return throwError(`PageViewerModule's CanActivateTab() is abstract. It must be extended.`);
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
        pathMatch: 'prefix'
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
  ],
  providers: [
    CatalogItems
  ]
})
export class PageViewerModule { }
