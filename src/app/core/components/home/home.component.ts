import { Component, NgModule, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { SvgViewerModule } from '@app/core/shared/svg-viewer/svg-viewer';
// import { ComponentPageTitle } from '../page-title/page-title';

@Component({
  selector: 'app-homepage',
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent implements OnInit {
  // isNextVersion = location.hostname.startsWith('next.material.angular.io');

  constructor() { }

  ngOnInit(): void {
    //  this._componentPageTitle.title = '';
  }
}

@NgModule({
  imports: [
    MatButtonModule,
    SvgViewerModule,
    RouterModule.forChild([{ path: '', component: HomeComponent }]),
  ],
  exports: [
    HomeComponent
  ],
  declarations: [
    HomeComponent
  ],
})
export class HomeModule { }
