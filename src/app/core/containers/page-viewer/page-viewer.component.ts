import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule, OnInit, ViewEncapsulation } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, ActivatedRouteSnapshot, Params, Router, RouterModule, Routes } from '@angular/router';
import { CatalogItems } from '@app/core/components/catalog/catalog-items';
import { Observable, Subscription } from 'rxjs';
import { FormTabComponent } from './form-tab/form-tab.component';
import { OptionsTabComponent } from './options-tab/options-tab.component';
import { TableTabComponent } from './table-tab/table-tab.component';

@Component({
  selector: 'app-page-viewer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="orl-primary-header">
      <h1>Catalog / {{ title }} </h1>
    </div>
    <nav mat-tab-nav-bar class="docs-component-viewer-tabbed-content">
      <a mat-tab-link class="docs-component-viewer-section-tab"
          *ngFor="let section of sections"
          [routerLink]="section.toLowerCase()"
          routerLinkActive #rla="routerLinkActive"
          [active]="rla.isActive">{{section}}</a>
    </nav>
    <div class="docs-component-viewer-content">
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
              public catalog: CatalogItems) {

               }

  ngOnInit() {
    const id = this.router.url.match('(?<=catalog\/)[a-z\-]*(?=([/])|$)');

    if (id) {
      const item = this.catalog.getItemById(id[0]);
      this.title = (item) ? item.name : '';
    } else {
      this.title = '';
    }

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
    MatTabsModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatPaginatorModule,
    RouterModule.forChild(routes),
    CommonModule
  ],
  exports: [
    PageViewerComponent
  ],
  declarations: [
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
