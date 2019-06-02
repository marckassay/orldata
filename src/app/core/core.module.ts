import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeComponent } from '../contents/home/home.component';
import { MaterialModule } from '../material/material.module';
// import { DatasetItemComponent } from './components/dataset-item.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
// import { MenuComponent } from './components/menu.component';
import { AppComponent } from './containers/app.component';
import { SvgViewerComponent } from './shared/svg-viewer/svg-viewer';
import { ThemePickerModule } from './shared/theme-picker';


export const COMPONENTS = [
  AppComponent,
  // DatasetItemComponent,
  HeaderComponent,
  HomeComponent,
  FooterComponent,
  SvgViewerComponent,
  // MenuComponent,
];

@NgModule({
  imports: [CommonModule, RouterModule, MaterialModule, ThemePickerModule],
  declarations: COMPONENTS,
  exports: COMPONENTS,
})
export class CoreModule { }
