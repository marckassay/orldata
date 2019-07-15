import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TableTabComponent } from '@core/containers/page-viewer/table-tab/table-tab.component';
import { select, Store } from '@ngrx/store';
import { PermitsTableTabActions } from '@permits/actions';
import * as fromPermits from '@permits/reducers';
import { Observable } from 'rxjs';

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

  count: Observable<number>;
  pageIndex: Observable<number>;
  limit: Observable<number>;

  displayedColumns: string[] = ['permit_number', 'application_type', 'processed_date'];
  dataSource = new MatTableDataSource<object>();
  expandedRecord: object | undefined;

  constructor(public store: Store<fromPermits.State>, private ref: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.store.pipe(select(fromPermits.getEntities))
      .subscribe((data) => {
        if (data !== undefined) {
          this.dataSource.data = data;
        }
      });

    this.count = this.store.pipe(select(fromPermits.getCount));
    this.pageIndex = this.store.pipe(select(fromPermits.getPageIndex));
    this.limit = this.store.pipe(select(fromPermits.getPageSize));

  }

  pageIndexChange(event: PageEvent) {
    this.store.dispatch(PermitsTableTabActions.paginate({ pageIndex: event.pageIndex }));
  }
}
