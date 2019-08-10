import { animate, state, style, transition, trigger } from '@angular/animations';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { ContentObserver } from '@angular/cdk/observers';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { scrollToTop } from '@app/core/shared/constants';
import { select, Store } from '@ngrx/store';
import { PermitsTableTabActions } from '@permits/actions';
import * as fromPermits from '@permits/reducers';
import { iif, Observable, of, Subject } from 'rxjs';
import { mergeMap, takeUntil } from 'rxjs/operators';

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
export class PermitsTableTabComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('orltable', { static: false, read: ElementRef }) table: ElementRef;

  private unsubscribe = new Subject<void>();

  count: Observable<number>;
  pageIndex: Observable<number>;
  limit: Observable<number>;

  displayedColumns: Array<string> = ['processed_date', 'permit_number', 'permit_address', 'application_type', 'property_owner_name'];
  columnsToDisplay: Array<string> = this.displayedColumns.slice();
  dataSource: Observable<Array<object>>;
  expandedRecord: object | undefined;

  isTableSubscribed: boolean;

  constructor(
    private store: Store<fromPermits.State>,
    private breakpoint: BreakpointObserver,
    private domObserver: ContentObserver,
    private ref: ChangeDetectorRef
  ) {
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
    ) as Observable<Array<object>>;

    this.observeBreakpoints();

    this.count = this.store.pipe(select(fromPermits.getCount));
    this.pageIndex = this.store.pipe(select(fromPermits.getPageIndex));
    this.limit = this.store.pipe(select(fromPermits.getPageSize));

    // since this limitation only pretains to subsequent visits, we need to dispatch action now
    // since the current rxjs expression in `observeTable` doesnt.
    this.store.dispatch(PermitsTableTabActions.cleaned());
  }

  ngAfterViewInit(): void {
    if (this.isTableSubscribed === false) {
      this.observeTable();
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  pageIndexChange(event: PageEvent) {
    this.store.dispatch(PermitsTableTabActions.paginate({ pageIndex: event.pageIndex }));
  }

  private observeTable() {
    /**
     * Without dispatching `PermitsTableTabActions.cleaned`, as it is done below, the table on
     * subsequent viewings, initially, would be still rendering. This happens even using a Router
     * resolver observing for `getLastResponseTime`.
     *
     * So the stream observes the table DOM and dispatches `cleaned`. This event is used in the
     * Router resolver instead of observing `getLastResponseTime`.
     *
     * @link https://github.com/angular/components/issues/8068#issuecomment-342307762
     * @link https://stackoverflow.com/questions/50375156/angular-listen-on-viewchild-changes
     * @link https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
     */
    if ((typeof this.table !== 'undefined')) {
      this.store.select(fromPermits.getEntities).pipe(
        takeUntil(this.unsubscribe),
        mergeMap(() => {
          return iif(() =>
            this.isTableSubscribed === false,
            this.domObserver.observe(this.table.nativeElement),
            of(false)
          );
        })
      ).subscribe(() => {
        this.isTableSubscribed = true;
        this.ref.markForCheck();
        scrollToTop();
        this.store.dispatch(PermitsTableTabActions.cleaned());
      });
    }
  }

  private observeBreakpoints() {
    this.breakpoint.observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium, Breakpoints.Large]).pipe(
      takeUntil(this.unsubscribe)
    ).subscribe((bps: BreakpointState) => {

      const cols = this.breakpointsColValue(
        Object.entries(bps.breakpoints)
          .find((value: [string, boolean]) => value[1])
      );

      this.columnsToDisplay = this.displayedColumns.slice(0, cols);
      this.ref.markForCheck();
    });
  }

  /**
   *
   * @link https://material.io/design/layout/responsive-layout-grid.html#breakpoints
   */
  private breakpointsColValue(key: [string, boolean] | string | undefined): number {
    const breakpoint = (key && key instanceof Array) ? key[0] : undefined;

    switch (breakpoint) {
      case Breakpoints.XSmall: return 2;
      case Breakpoints.Small: return 3;
      case Breakpoints.Medium: return 4;
      case Breakpoints.Large: return 5;
      case Breakpoints.XLarge: return 6;
      default: return 3;
    }
  }
}
