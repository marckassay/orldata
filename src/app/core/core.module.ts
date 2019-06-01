import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material/material.module';
import { DatasetItemComponent } from './components/dataset-item.component';
import { FooterComponent } from './components/footer.component';
import { HomeComponent } from './components/home.component';
import { MenuComponent } from './components/menu.component';
import { ToolbarComponent } from './components/toolbar.component';
import { AppComponent } from './containers/app.component';
import { LayoutComponent } from './containers/layout.component';


export const COMPONENTS = [
  AppComponent,
  LayoutComponent,
  DatasetItemComponent,
  ToolbarComponent,
  HomeComponent,
  FooterComponent,
  MenuComponent,
];

@NgModule({
  imports: [CommonModule, RouterModule, MaterialModule],
  declarations: COMPONENTS,
  exports: COMPONENTS,
})
export class CoreModule { }
