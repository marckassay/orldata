import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { ThemePickerModule } from '../../shared/theme-picker';
/* import { VersionPickerModule } from '../version-picker';
import { SECTIONS } from '../documentation-items/documentation-items'; */

// const SECTIONS_KEYS = Object.keys(SECTIONS);

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class HeaderComponent {
 // isNextVersion = location.hostname.startsWith('next.material.angular.io');
/*
  get sections() {
    return SECTIONS;
  }

  get sectionKeys() {
    return SECTIONS_KEYS;
  } */
}

@NgModule({
  imports: [
    MatButtonModule,
    MatMenuModule,
    RouterModule,
     ThemePickerModule,
   /* VersionPickerModule, */
    CommonModule
  ],
  exports: [HeaderComponent],
  declarations: [HeaderComponent],
})
export class HeaderModule { }
