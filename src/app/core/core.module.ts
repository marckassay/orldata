import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { AppComponent } from './containers/app.component';
import { AccountDialogModule } from './shared/account-dialog';
import { ProgressBarModule } from './shared/progress-bar/progress-bar.component';

@NgModule({
  imports: [
    CommonModule,
    // TODO: For now, synchronously load HomeModule to prevent any rendering "jumping" of elements.
    // Although I attempted to preload it, but wasn't able to successfully.
    // @link https://angular.io/guide/router#preloading-background-loading-of-feature-areas
    // HomeModule,
    MatIconModule,
    MatProgressBarModule,
    MatButtonModule,
    RouterModule,
    ProgressBarModule,
    AccountDialogModule,
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
