import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRouteSnapshot, CanActivate, Resolve, RouterModule, RouterStateSnapshot, UrlTree } from '@angular/router';
import { CatalogItems } from '@app/core/components/catalog/catalog-items';
import { CheckboxGridModule } from '@app/core/shared/checkbox-grid/checkbox-grid.module';
import { FieldTypePipe } from '@core/shared/field-type.pipe';
import { GeoLocationPipe } from '@core/shared/geo-location.pipe';
import { LabelCasePipe } from '@core/shared/label-case.pipe';
import { MailAddressPipe } from '@core/shared/mail-address.pipe';
import { NumericLimitPipe } from '@core/shared/numeric-limit.pipe';
import { CoordinatesModule } from 'angular-coordinates';
import { Observable, throwError } from 'rxjs';
import { FormTabComponent } from './form-tab/form-tab.component';
import { PageViewerComponent } from './page-viewer.component';
import { TableTabComponent } from './table-tab/table-tab.component';

/**
 * @source https://angular.io/guide/router#resolve-pre-fetching-component-data
 */
export abstract class TableTabResolver<T> implements Resolve<T> {
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<T> {
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

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CoordinatesModule,
    MatButtonModule,
    MatBadgeModule,
    MatTabsModule,
    MatTableModule,
    MatAutocompleteModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatPaginatorModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatGridListModule,
    MatCheckboxModule,
    MatFormFieldModule,
    CheckboxGridModule,
    RouterModule.forChild([]),
    CommonModule,
  ],
  exports: [
    LabelCasePipe,
    FieldTypePipe,
    GeoLocationPipe,
    NumericLimitPipe,
    MailAddressPipe,
    CoordinatesModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatBadgeModule,
    MatTabsModule,
    MatTableModule,
    MatAutocompleteModule,
    MatPaginatorModule,
    MatInputModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatSelectModule,
    MatCardModule,
    MatGridListModule,
    MatCheckboxModule,
    MatFormFieldModule,
    CheckboxGridModule,
    TableTabComponent,
    FormTabComponent,
    PageViewerComponent,
    CommonModule,
  ],
  declarations: [
    LabelCasePipe,
    FieldTypePipe,
    GeoLocationPipe,
    NumericLimitPipe,
    MailAddressPipe,
    TableTabComponent,
    FormTabComponent,
    PageViewerComponent,
  ],
  providers: [
    CatalogItems
  ]
})
export class PageViewerModule { }
