import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import * as fromCore from '@app/core/reducers';
import * as fromMSAL from '@app/core/reducers/msal.reducer';
import { select, Store } from '@ngrx/store';
import { ThemePickerComponent } from '../theme-picker';
import { DialogModule } from './dialog';
import { DialogService } from './dialog/dialog.service';

@Component({
  selector: 'account-dialog',
  template: `
  <button mat-icon-button matTooltip="Account Menu" (click)="openDialog()" tabindex="1">
    <mat-icon>account_circle</mat-icon>
  </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class AccountDialogComponent implements OnInit, OnDestroy {

  identity: fromMSAL.State;

  constructor(
    public service: DialogService,
    // keep ThemePickerComponent injected here so that theme will be applied upon launched. otherwise user would need to click on this
    // component so that theme will be applied.
    public theme: ThemePickerComponent,
    private store: Store<fromCore.State>) {
  }

  ngOnInit() {
    this.store.pipe(
      select(fromCore.getIdentity),
    ).subscribe((value) => {
      this.identity = value;
    });
  }

  ngOnDestroy() {
  }

  openDialog(): void {
    // ref: https://material.angular.io/components/dialog/api#MatDialogConfig
    this.service.openDialog();
  }
}

@NgModule({
  imports: [
    DialogModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    CommonModule
  ],
  exports: [AccountDialogComponent],
  declarations: [AccountDialogComponent]
})
export class AccountDialogModule { }
