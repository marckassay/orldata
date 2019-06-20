import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, NgModule, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import * as fromCore from '@core/reducers';
import { select, Store } from '@ngrx/store';
import { filter } from 'rxjs/operators';
import { CatalogItem, CatalogItems } from './catalog-items';


@Component({
  selector: 'app-catalog',
  template: `
  <div class="orl-primary-header">
    <h1>Catalog</h1>
  </div>

  <mat-nav-list class="orl-catalog-list">
    <h3 mat-subheader>Datasets</h3>

    <a *ngFor="let item of catalogItems.getAllItems()"
      mat-list-item class="orl-catalog-item"
      [routerLink]="item.disabled ? null : ['/catalog', item.routeLink]"
      [class.disabled]="item.disabled ? true : false" >
      <mat-icon matListIcon [color]="item.disabled ? 'disabled-87' : 'primary'" >folder</mat-icon>
      <h3 mat-line>{{item.name}}</h3>
      <h4 mat-line *ngIf="item.dataUpdatedAt">Last Updated: {{item.dataUpdatedAt | date}}</h4>
      <p mat-line>{{item.description}}</p>
    </a>

  </mat-nav-list>
  `,
  styleUrls: ['./catalog.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class CatalogComponent implements OnInit {

  constructor(public catalogItems: CatalogItems,
              private ref: ChangeDetectorRef,
              public router: Router,
              public route: ActivatedRoute,
              public store: Store<fromCore.State>) { }

  ngOnInit() {
    this.store.pipe(
      select(fromCore.getPermitsMetadata),
      filter(metadata => metadata !== undefined)
    ).subscribe((value) => this.updateCatalogItem(value as CatalogItem));

    this.store.pipe(
      select(fromCore.getCrimesMetadata),
      filter(metadata => metadata !== undefined)
    ).subscribe((value) => this.updateCatalogItem(value as CatalogItem));

    // datasets are prefetched by RouterEffects
  }

  updateCatalogItem = (metadata: CatalogItem) => {
    const item = this.catalogItems.getItemById(metadata.id);
    if (item) {
      item.name = metadata.name;
      item.category = metadata.category;
      item.description = metadata.description;
      if (metadata.dataUpdatedAt) {
        item.dataUpdatedAt = new Date(metadata.dataUpdatedAt);
      }
      this.ref.markForCheck();
    }
  }

  onClick(item: CatalogItem) {
    this.router.navigate(['/catalog', item.routeLink]);
  }
}

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatListModule,
    RouterModule.forChild([{ path: '', component: CatalogComponent }]),
  ],
  exports: [
    CatalogComponent
  ],
  declarations: [
    CatalogComponent
  ],
  providers: [
    CatalogItems
  ]
})
export class CatalogModule { }
