import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, ActivatedRouteSnapshot, Params, Router, RouterModule, Routes } from '@angular/router';
import { CatalogItems } from '@app/core/components/catalog/catalog-items';
import { CheckboxGridModule } from '@app/core/shared/checkbox-grid/checkbox-grid.module';
import { FieldTitleCasePipe } from '@app/core/shared/fieldtitlecase.pipe';
import { PermitViewerActions } from '@app/permits/actions';
import { Store } from '@ngrx/store';
import * as fromPermits from '@permits/reducers';
import { Observable, Subscription } from 'rxjs';
import { FormTabComponent } from './form-tab/form-tab.component';
import { OptionsTabComponent } from './options-tab/options-tab.component';
import { TableTabComponent } from './table-tab/table-tab.component';


@Component({
  selector: 'app-page-viewer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="orl-primary-header">
      <h1>Catalog / {{ title | titlecase }} </h1>
    </div>
    <nav mat-tab-nav-bar class="orl-component-viewer-tabbed-content">
      <a mat-tab-link class="orl-component-viewer-section-tab"
          *ngFor="let section of sections"
          [routerLink]="section.toLowerCase()"
          routerLinkActive #rla="routerLinkActive"
          [active]="rla.isActive">{{section}}</a>
    </nav>
    <div class="orl-component-viewer-content">
      <router-outlet></router-outlet>
    </div>
  `,
  styleUrls: ['page-viewer.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PageViewerComponent implements OnInit {
  title: string;

  // sections: Set<string> = new Set(['Table', 'Form', 'Options']);
  sections: Set<string> = new Set(['Table', 'Form']);
  params: Observable<Params>;
  routeParamSubscription: Subscription;
  activedRoute: ActivatedRouteSnapshot;

  constructor(public router: Router,
              public route: ActivatedRoute,
              public store: Store<fromPermits.State>,
              public catalog: CatalogItems) {
    this.title = '';
               }

  ngOnInit() {
    const id = this.router.url.match('(?<=catalog\/)[a-z\-]*(?=([/])|$)');

    if (id) {
      const item = this.catalog.getItemByName(id[0]);
      this.title = (item) ? item.routeLink : '';
    }

    this.store.dispatch(PermitViewerActions.getSearchFormData());
  }
}

export const routes: Routes = [
  {
    path: '',
    component: PageViewerComponent,
    children: [
      { path: '', redirectTo: 'table', pathMatch: 'full' },
      { path: 'table', component: TableTabComponent, pathMatch: 'full' },
      { path: 'form', component: FormTabComponent, pathMatch: 'full' },
      // { path: 'options', component: OptionsTabComponent, pathMatch: 'full' },
      { path: '**', redirectTo: 'table' },
    ],
  }
];

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
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
    FieldTitleCasePipe,
    PageViewerComponent,
    TableTabComponent,
    FormTabComponent,
    OptionsTabComponent
  ],
  providers: [
    CatalogItems
  ]
})
export class PageViewerModule { }
