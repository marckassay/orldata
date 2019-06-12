import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { MatProgressBar } from '@angular/material/progress-bar';
import * as fromCore from '@core/reducers';
import { select, Store } from '@ngrx/store';
import { Observable, of, timer } from 'rxjs';
import { delayWhen, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';


enum StyleVisibilityString {
  VISIBLE = 'visible',
  HIDDEN = 'hidden'
}

@Component({
  selector: 'orl-progress-bar',
  template: `
  <div class="host-progress-bar" >
    <mat-progress-bar
      color="accent"
      mode="indeterminate"
      [style.visibility]="visibility$ | async">
    </mat-progress-bar>
  </div>
  `,
  changeDetection: ChangeDetectionStrategy.Default
})
export class ProgressBarComponent implements OnInit {

  @ViewChild(MatProgressBar, { static: true })
  progressBar: MatProgressBar;

  public visibility$: Observable<StyleVisibilityString | string>;

  throttleTime: number;

  constructor(public store: Store<fromCore.State>) {
    this.throttleTime = 2000;
  }

  ngOnInit(): void {
    this.visibility$ = this.store.pipe(
      select(fromCore.getCommunicatingStatus),
      map(status => status === true ? StyleVisibilityString.VISIBLE : StyleVisibilityString.HIDDEN),
      distinctUntilChanged((x, y) => {
        return x === y;
      }),
      switchMap((emitted) => {
        if (emitted === StyleVisibilityString.VISIBLE) {
          return of(emitted);
        } else {
          return of(emitted).pipe(
            delayWhen(() => timer(this.throttleTime))
          );
        }
      }),
      tap((va) => console.log('----->>', va))
    );
  }
}
