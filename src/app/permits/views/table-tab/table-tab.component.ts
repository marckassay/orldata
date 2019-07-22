import { animate, state, style, transition, trigger } from '@angular/animations';
import { ContentObserver } from '@angular/cdk/observers';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { TableTabComponent } from '@core/containers/page-viewer/table-tab/table-tab.component';
import { select, Store } from '@ngrx/store';
import { PermitsTableTabActions } from '@permits/actions';
import * as fromPermits from '@permits/reducers';
import { defer, iif, Observable, of, throwError } from 'rxjs';
import { catchError, debounceTime, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'permits-table-tab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'table-tab.html',
  // ViewEncapsulation.Emulated (vs None) has been set to allow detailExpand to work as expected.
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['table-tab.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class PermitsTableTabComponent implements OnInit {

  @ViewChild('orl-table-tab', { static: false })
  orlTab: TableTabComponent;

  @ViewChild('orltable', { static: false })
  table: ElementRef;

  count: Observable<number>;
  pageIndex: Observable<number>;
  limit: Observable<number>;

  displayedColumns: string[] = ['permit_number', 'application_type', 'processed_date'];
  dataSource: Observable<object[]>;
  expandedRecord: object | undefined;

  isTableSubscribed: boolean;

  constructor(private store: Store<fromPermits.State>, private domObserver: ContentObserver, private ref: ChangeDetectorRef) {
    this.isTableSubscribed = false;
  }

  ngOnInit() {

    /**
     * If you are reading this and wondering why this stream emits 2 identical arrays, its probably
     * because of `StoreDevToolsModule`.
     * @link https://github.com/ngrx/platform/issues/1325
     */
    this.dataSource = this.store.pipe(
      select(fromPermits.getEntities),
    ) as Observable<object[]>;

    this.observeTable();

    this.count = this.store.pipe(select(fromPermits.getCount));
    this.pageIndex = this.store.pipe(select(fromPermits.getPageIndex));
    this.limit = this.store.pipe(select(fromPermits.getPageSize));

    // since this limitation only pretains to subsequent visits, we need to dispatch action now
    // since the current rxjs expression in `observeTable` doesnt.
    this.store.dispatch(PermitsTableTabActions.cleaned);
  }

  private observeTable() {
    /**
     * Without dispatching `PermitsTableTabActions.updated`, as it is done below, the table on
     * subsequent viewings, initially, would be still rendering. This happens even using a Router
     * resolver observing `getLastResponseTime`.
     *
     * So the stream observes the table DOM and dispatches `updated`. This event is used in the
     * Router resolver instead of observing `getLastResponseTime`. As suggested in link below, this
     * stream was developed from that idea.
     *
     * The `debounceTime` is there as a hack. My assumpation was that just `observe()` would of
     * dispatched just one type of event. But its a non-specific and may dispatch more than one.
     *
     * TODO: perhaps `observe` a child element would eliminate having more than 1 event
     * dispatched.
     *
     * @link https://github.com/angular/components/issues/8068#issuecomment-342307762
     */

    this.store.select(fromPermits.getEntities).pipe(
      mergeMap(() => {
        return iif(() =>
          ((typeof this.table !== 'undefined') && (this.isTableSubscribed === false)),
          defer(() => this.domObserver.observe((this.table as any)._elementRef.nativeElement)),
          of()).pipe(
            debounceTime(500),
            catchError(error => throwError(error))
          );
      })
    ).subscribe(() => {
      this.isTableSubscribed = true;
      this.ref.markForCheck();
      this.store.dispatch(PermitsTableTabActions.cleaned);
    });
  }

  pageIndexChange(event: PageEvent) {
    this.store.dispatch(PermitsTableTabActions.paginate({ pageIndex: event.pageIndex }));
  }
}
