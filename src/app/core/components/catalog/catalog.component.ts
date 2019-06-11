import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, NgModule, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CatalogActions } from '@app/core/actions';
import * as fromCore from '@core/reducers';
import { select, Store } from '@ngrx/store';
import { CatalogItem, CatalogItems } from './catalog-items';


@Component({
  selector: 'app-catalog',
  template: `
  <div class="orl-primary-header">
    <h1>Catalog</h1>
  </div>

  <mat-nav-list class="orl-catalog-list">
    <h3 mat-subheader>Datasets</h3>

    <a mat-list-item class="orl-catalog-item" *ngFor="let item of catalogItems.getAllItems()"
      [routerLink]="['/catalog', item.id]">
      <mat-icon matListIcon color="primary">folder</mat-icon>
      <h4 mat-line>{{item.name}}</h4>
      <p mat-line *ngIf="item.updated">Last Updated: {{item.updated | date}} </p>
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
              public store: Store<fromCore.State>) {

  }

  ngOnInit() {
    this.store.pipe(
      select(fromCore.geHeaderState)
    ).subscribe(data => {
      data.header.map((entry: any) => {
        const permitItem = this.catalogItems.getItemById('permits') as CatalogItem;
        permitItem.updated = new Date(entry.processed_date);
        this.ref.markForCheck();
      });
  });

    this.store.dispatch(CatalogActions.requestForLastModifiedDate());

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
