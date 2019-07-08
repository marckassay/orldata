import { ChangeDetectionStrategy, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { PermitsTableTabActions } from '@app/permits/actions';
import { select, Store } from '@ngrx/store';
import * as fromPermits from '@permits/reducers';
import { Observable } from 'rxjs';

@Component({
  selector: 'orl-table-tab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'table-tab.html',
  styleUrls: ['table-tab.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TableTabComponent implements OnInit {
  displayedColumns: string[] = ['permit_number', 'application_type', 'processed_date'];
  dataSource = new MatTableDataSource<object>();

  count: Observable<number>;
  pageIndex: Observable<number>;
  limit: Observable<number>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(public store: Store<fromPermits.State>) { }

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
