import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
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
export class TableTabComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['processed_date', 'application_type'];
  dataSource = new MatTableDataSource<object>();

  count: Observable<number>;
  pageIndex: Observable<number>;
  limit: Observable<number>;

  // TODO: prepare to present issues to user when it occurs
  isRateLimitReached = false;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  // TODO: Have `PageViewerComponent` accept a generic that extends from a common subject type. This
  // likely will need to be specified in the RoutingModule.
  constructor(public store: Store<fromPermits.State>) { }

  ngOnInit() {
    this.store.pipe(select(fromPermits.getPermitEntitiesState))
      .subscribe(data => this.dataSource.data = data);

    this.pageIndex = this.store.pipe(select(fromPermits.getOffset));
    this.count = this.store.pipe(select(fromPermits.getCount));
    this.limit = this.store.pipe(select(fromPermits.getSearchLimit));
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;

    // this.store.dispatch(SearchPermitsActions.search({ payload: { query: 'Building Permit', offset: this.paginator.pageIndex } }));
  }

  pageIndexChange(event: PageEvent) {
    // this.store.dispatch(SearchPermitsActions.search({ payload: { query: 'Building Permit', offset: event.pageIndex } }));
  }
}
