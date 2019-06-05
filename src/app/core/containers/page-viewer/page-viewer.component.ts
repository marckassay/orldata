import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule, OnInit, ViewEncapsulation } from '@angular/core';
import { MatPaginatorModule, MatProgressSpinnerModule, MatTableModule, MatTabsModule } from '@angular/material';
import { ActivatedRoute, ActivatedRouteSnapshot, Params, Router, RouterModule } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { CatalogItems } from '../../components/catalog/catalog-items';
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
              public catalog: CatalogItems) { }

  ngOnInit() {
    const id = this.router.url.match('(?<=catalog\/)[a-z\-]*(?=([/])|$)')
    .map(value => (value !== undefined) ? value : '')[0];

    this.title = this.catalog.getItemById(id).name;
  }
}

@NgModule({
  imports: [
    MatTabsModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatPaginatorModule,
    RouterModule,
    CommonModule
  ],
  exports: [
    PageViewerComponent
  ],
  declarations: [
    PageViewerComponent,
    TableTabComponent,
    FormTabComponent,
    OptionsTabComponent]
})
export class PageViewerModule { }
