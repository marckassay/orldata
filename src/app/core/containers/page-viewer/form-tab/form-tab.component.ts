import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as fromPermits from '@permits/reducers';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'orl-form-tab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'form-tab.html',
  encapsulation: ViewEncapsulation.None,
  styles: [`
  .orl-search-container {
    display: flex;
    flex-direction: column;
  }

  .orl-search-container > * {

  }

  .orl-search-section {
    display: flex;
    align-content: center;
    align-items: center;
  }

  .orl-search-margin {
    margin: 0 10px;
  }

  p {
    font-size: 14px;
  }
  .mat-grid-tile .mat-figure {
    justify-content: start;
  }
  `]
})
export class FormTabComponent implements OnInit, AfterViewInit {

  applicationTypes: string[] | any;

  constructor(private store: Store<fromPermits.State>) { }

  ngOnInit() {
    this.store.pipe(
      select(fromPermits.getApplicationTypes),
      catchError(error => throwError(error))
    ).subscribe((types) => {
      this.applicationTypes = types;
    });
    /*
    this.store.pipe(select(fromPermits.getSelectedApplicationTypes));

    this.store.pipe(select(fromPermits.getWorkTypes));
    this.store.pipe(select(fromPermits.getSelectedWorkTypes));

    this.store.pipe(select(fromPermits.getProcessedDate));
    this.store.pipe(select(fromPermits.getProcessedDateOperator));
    this.store.pipe(select(fromPermits.getSecondaryProcessedDate));
    */
  }

  ngAfterViewInit() {

  }

  search() {
   // this.store.dispatch(SearchPermitsActions.search({}));
  }
}
