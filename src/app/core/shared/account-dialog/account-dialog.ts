import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThemePickerModule } from '../theme-picker';

/* export interface DialogData {
  name: string;
  city: string;
  country: string;
  theme: string;
}

@Component({
  selector: 'dialog',
  templateUrl: 'dialog.html',
})
export class DialogComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
} */
// [mat-menu-trigger-for]="openDialog"
@Component({
  selector: 'account-dialog',
  template: `
  <button mat-icon-button matTooltip="Account Menu" tabindex="1">
    <mat-icon>account_circle</mat-icon>
  </button>
  `,
  styleUrls: ['account-dialog.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class AccountDialogComponent implements OnInit, OnDestroy {
  // @HostBinding('attr.aria-hidden') hidden = true;

  /*
    idp: "github.com"
    name: "marckassay"
    city: "Orlando"
    country: "United States"
  */
  name: string;
  city: string;
  country: string;
  theme: string;

  constructor(public dialog: MatDialog) { }
  /*
    openDialog(): void {
      const dialogRef = this.dialog.open(DialogComponent, {
        width: '250px',
        data: { name: this.name, city: this.city }
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        // this.animal = result;
      });
    } */
  ngOnInit() {
  }

  ngOnDestroy() {
  }
}

@NgModule({
  imports: [
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatGridListModule,
    MatTooltipModule,
    MatDialogModule,
    ThemePickerModule,
    CommonModule
  ],
  exports: [AccountDialogComponent],
  declarations: [AccountDialogComponent]
})
export class AccountDialogModule { }
