import { CommonModule } from '@angular/common';
import { Component, NgModule, OnDestroy, OnInit } from '@angular/core';
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
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'orldata-dialog',
    templateUrl: 'dialog.html',
    styleUrls: ['dialog.scss']
})
export class DialogComponent implements OnInit, OnDestroy {

    useWhiteFill: boolean;
    identity: fromMSAL.State;
    private unsubscribe = new Subject<void>();

    constructor(
        public dialogRef: MatDialogRef<DialogComponent>,
        private store: Store<fromCore.State>,
        public theme: ThemePickerComponent,
    ) { }

    ngOnInit() {
        this.store.pipe(
            select(fromCore.getIdentity),
            takeUntil(this.unsubscribe)
        ).subscribe((value) => {
            this.identity = value;
        });

        const currentTheme = this.theme.themes.find((value) => value.name === this.theme.themeStorage.getStoredThemeName());
        this.useWhiteFill = (currentTheme as DocsSiteTheme).isDark === true;

        this.theme.themeStorage.themeUpdate.subscribe((value: DocsSiteTheme) => {
            this.useWhiteFill = value.isDark === true;
        });
    }

    onSignOnOrOff(): void {
        if (this.identity.idp) {
            this.store.dispatch(AppApiActions.logoutClicked());
        } else {
            this.store.dispatch(AppApiActions.loginClicked());
        }

        this.dialogRef.close();
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
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
    entryComponents: [DialogComponent],
    exports: [DialogComponent],
    declarations: [DialogComponent]
})
export class DialogModule { }
