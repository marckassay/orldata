import { Component, NgModule, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { CatalogItems } from 'src/app/core/shared/catalog-items/catalog-items';
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
  imports: [MatButtonModule, RouterModule],
  exports: [CatalogComponent],
  declarations: [CatalogComponent],
  providers: [CatalogItems]
})
export class CatalogModule { }
