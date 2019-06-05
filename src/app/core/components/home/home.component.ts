import { Component, NgModule, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
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
  imports: [MatButtonModule, RouterModule],
  exports: [HomeComponent],
  declarations: [HomeComponent],
})
export class HomepageModule { }
