import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Params, Router } from '@angular/router';
import { CatalogItems } from '@app/core/components/catalog/catalog-items';
import { select, Store } from '@ngrx/store';
import * as fromPermits from '@permits/reducers';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-page-viewer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="orl-primary-header">
      <h1>Catalog / {{ title | titlecase }} </h1>
    </div>

    <nav mat-tab-nav-bar class="orl-component-viewer-tabbed-content">
      <a mat-tab-link *ngIf="(count$ | async) > 0"
          class="orl-component-viewer-section-tab"
          routerLink="table"
          routerLinkActive #tableRla="routerLinkActive"
          [active]="tableRla.isActive">
            <span class='orl-badge-content' [matBadge]="count$ | async | numericlimit" matBadgeOverlap="false">TABLE</span>
          </a>
      <a mat-tab-link *ngIf="(count$ | async) <= 0"
          class="orl-component-viewer-section-tab disabled"
          class="disabled">
            <span class='orl-badge-content' [matBadge]="count$ | async | numericlimit" matBadgeOverlap="false">TABLE</span>
          </a>

      <a mat-tab-link class="orl-component-viewer-section-tab"
          routerLink="form"
          routerLinkActive #formRla="routerLinkActive"
          [active]="formRla.isActive">Form</a>

      <a mat-tab-link class="orl-component-viewer-section-tab"
          [attr.disabled]="true"
          routerLink="options"
          routerLinkActive #optionsRla="routerLinkActive"
          [active]="optionsRla.isActive">Options</a>
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
  count$: Observable<number>;

  params: Observable<Params>;
  routeParamSubscription: Subscription;
  activedRoute: ActivatedRouteSnapshot;

  constructor(
    public router: Router,
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

    this.count$ = this.store.pipe(select(fromPermits.getCount));
  }
}
