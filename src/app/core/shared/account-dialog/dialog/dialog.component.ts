import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AppApiActions } from '@core/actions';
import * as fromCore from '@core/reducers';
import * as fromMSAL from '@core/reducers/msal.reducer';
import { ProgressBarModule } from '@core/shared/progress-bar/progress-bar.component';
import { ThemePickerComponent, ThemePickerModule } from '@core/shared/theme-picker';
import { DocsSiteTheme } from '@core/shared/theme-picker/theme-storage/theme-storage';
import { select, Store } from '@ngrx/store';

@Component({
    selector: 'orldata-dialog',
    templateUrl: 'dialog.html',
    styleUrls: ['dialog.scss']
})
export class DialogComponent implements OnInit {

    useWhiteFill: boolean;
    identity: fromMSAL.State;

    constructor(
        public dialogRef: MatDialogRef<DialogComponent>,
        public theme: ThemePickerComponent,
        private store: Store<fromCore.State>) { }

    ngOnInit() {
        this.store.pipe(
            select(fromCore.getIdentity),
        ).subscribe((value) => {
            this.identity = value;
        });

        this.theme.themeStorage.themeUpdate.subscribe((value: DocsSiteTheme) => {
            this.useWhiteFill = value.isDark === true;
        });
    }

    onSignOnOrOff(): void {
        if (this.identity.idp) {
            this.store.dispatch(AppApiActions.logoutClicked());
            this.dialogRef.close();
        } else {

        }
    }
}

@NgModule({
    imports: [
        MatButtonModule,
        MatIconModule,
        MatGridListModule,
        MatTooltipModule,
        MatDialogModule,
        ProgressBarModule,
        ThemePickerModule,
        CommonModule
    ],
    exports: [DialogComponent],
    declarations: [DialogComponent]
})
export class DialogModule { }
