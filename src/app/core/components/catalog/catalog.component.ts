import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { CatalogItems } from './catalog-items';
// import { ComponentPageTitle } from '../page-title/page-title';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.html',
  styleUrls: ['./catalog.scss']
})
export class CatalogComponent implements OnInit {
  // isNextVersion = location.hostname.startsWith('next.material.angular.io');

  constructor(public catalogItems: CatalogItems) { }

  ngOnInit(): void {
    //  this._componentPageTitle.title = '';
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
