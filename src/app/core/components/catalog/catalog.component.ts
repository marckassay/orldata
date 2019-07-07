import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, NgModule, OnInit, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
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

  <! --
    Attempted to change tooltip background color in the mixin-theme file but wasn't able to. In the
    catalog.sass I was able to. Form material doc's example, I used: [matTooltipClass]="orl-tooltip-color"
  -->
  <mat-nav-list class="orl-catalog-list">
    <h3 mat-subheader>Datasets</h3>
    <ng-container *ngFor="let item of catalogItems.getAllItems()">
    <a *ngIf="item.disabled !== true"
        mat-list-item
        class="orl-catalog-item"
        [matTooltip]="item.description"
        (click)="onClick(item)">

      <mat-icon matListIcon color="primary">folder</mat-icon>
      <h3 mat-line>{{item.name}}</h3>
      <h4 mat-line *ngIf="item.dataUpdatedAt">Last Updated: {{item.dataUpdatedAt | date}}</h4>
      <p mat-line>{{item.description}}</p>
    </a>

    <a *ngIf="item.disabled === true"
        mat-list-item
        class="orl-catalog-item disabled" >
      <mat-icon matListIcon>folder</mat-icon>
      <h3 mat-line>{{item.name}}</h3>
      <h4 mat-line *ngIf="item.dataUpdatedAt">Last Updated: {{item.dataUpdatedAt | date}}</h4>
      <p mat-line>{{item.description}}</p>
    </a>
    </ng-container>
  </mat-nav-list>
  `,
  styleUrls: ['./catalog.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  // if set to 'None' as recommended by ang-mat docs, footer raises to away from bottom edge
  encapsulation: ViewEncapsulation.Emulated
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

    // datasets are prefetched by:
    //  src\app\core\effects\router.effects.ts
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
    MatTooltipModule,
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
