import { Component, OnInit, ViewChild } from '@angular/core';
import { MatProgressBar } from '@angular/material/progress-bar';
import * as fromCore from '@core/reducers';
import { ProgressbarDelay } from '@core/shared/constants';
import { select, Store } from '@ngrx/store';
import { Observable, of, timer } from 'rxjs';
import { delayWhen, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'orl-progress-bar',
  template: `
  <div class="super-host-progress-bar">
  <div class="host-progress-bar" *ngIf="visibility | async">
    <mat-progress-bar
      color="accent"
      mode="indeterminate">
    </mat-progress-bar>
  </div>
  </div>
  `,
  styles: [`
    .super-host-progress-bar {
      height: 4px;
    }
  `]
})
export class ProgressBarComponent implements OnInit {

  @ViewChild(MatProgressBar, { static: false })
  progressBar: MatProgressBar;

  public visibility: Observable<boolean>;

  throttleTime: number;

  constructor(public store: Store<fromCore.State>) {
    this.throttleTime = ProgressbarDelay;
  }

  ngOnInit(): void {

    // And this approcach below has limitations. perhaps 'bootstrapping' a service as recommended is
    // better: https://stackoverflow.com/a/37070282
    this.visibility = this.store.pipe(
      select(fromCore.getCommunicatingStatus),
      distinctUntilChanged((x, y) => {
        return x === y;
      }),
      switchMap((newValue) => {
        if (newValue) {
          return of(true);
        } else {
          return of(false).pipe(
            delayWhen(() => timer(this.throttleTime))
          );
        }
      })
    );
  }
}
