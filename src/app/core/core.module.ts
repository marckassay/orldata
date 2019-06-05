import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material/material.module';
import { CatalogItems } from './components/catalog/catalog-items';
import { CatalogComponent } from './components/catalog/catalog.component';
// import { DatasetItemComponent } from './components/dataset-item.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
// import { MenuComponent } from './components/menu.component';
import { AppComponent } from './containers/app.component';
import { SvgViewerComponent } from './shared/svg-viewer/svg-viewer';
import { ThemePickerModule } from './shared/theme-picker';


export const COMPONENTS = [
  AppComponent,
  // DatasetItemComponent,
  HeaderComponent,
  HomeComponent,
  CatalogComponent,
  FooterComponent,
  SvgViewerComponent
  // MenuComponent,
];

@NgModule({
  imports: [CommonModule, RouterModule, MaterialModule, ThemePickerModule],
  declarations: COMPONENTS,
  exports: COMPONENTS,
  providers: [
    CatalogItems
  ]
})
export class CoreModule { }
