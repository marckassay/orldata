import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './dialog.component';

@Injectable({
    providedIn: 'root',
})
export class DialogService {

    constructor(
        public dialog: MatDialog
    ) { }

    openDialog(): void {
        // ref: https://material.angular.io/components/dialog/api#MatDialogConfig
        this.dialog.open(DialogComponent, { autoFocus: false });
    }
}
