import { CommonModule } from '@angular/common';
import { Injectable, NgModule, OnInit } from '@angular/core';
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
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterModule, RouterStateSnapshot, Routes, UrlTree } from '@angular/router';
import { CatalogItems } from '@app/core/components/catalog/catalog-items';
import { CheckboxGridModule } from '@app/core/shared/checkbox-grid/checkbox-grid.module';
import { NumericLimitPipe } from '@app/core/shared/numericlimit.pipe';
import { select, Store } from '@ngrx/store';
import * as fromPermits from '@permits/reducers';
import { Observable } from 'rxjs';
import { FormTabComponent } from './form-tab/form-tab.component';
import { OptionsTabComponent } from './options-tab/options-tab.component';
import { PageViewerComponent } from './page-viewer.component';
import { TableTabComponent } from './table-tab/table-tab.component';

@Injectable({
  providedIn: 'root',
})
class CanActivateTab implements OnInit, CanActivate {

  count: number;

  constructor(public store: Store<fromPermits.State>, public router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
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
      { path: '', redirectTo: 'table', pathMatch: 'full' },
      { path: 'table', component: TableTabComponent, pathMatch: 'full', canActivate: [CanActivateTab] },
      { path: 'form', component: FormTabComponent, pathMatch: 'full' },
/*       { path: 'options', component: OptionsTabComponent, pathMatch: 'full', redirectTo: 'table' }, */
     /*   { path: '/form', redirectTo: 'table' }, */
      { path: '**', redirectTo: 'table' }
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
