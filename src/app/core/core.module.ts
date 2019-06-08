import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { AppComponent } from './containers/app.component';
import { ThemePickerModule } from './shared/theme-picker';


@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    ThemePickerModule
  ],
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent
  ],
  exports: [
    AppComponent,
    HeaderComponent,
    FooterComponent
  ]
})
export class CoreModule { }
