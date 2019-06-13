import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { select, Store } from '@ngrx/store';
import { SearchPermitsActions } from '@permits/actions';
import * as fromResults from '@permits/reducers';
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
  dataSource = new MatTableDataSource();

  pageIndex: Observable<number>;

  // TODO: prepare to present issues to user when it occurs
  isRateLimitReached = false;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(public store: Store<fromResults.State>) {

  }

  ngOnInit() {
    this.store.pipe(
      select(fromResults.getPermitEntitiesState)
    ).subscribe(data => this.dataSource.data = data);

    this.pageIndex = this.store.pipe(select(fromResults.getSearchPage));
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;

    this.store.dispatch(SearchPermitsActions.search({ payload: { query: 'Building Permit', offset: this.paginator.pageIndex } }));
  }

  pageIndexChange(event: PageEvent) {
    this.store.dispatch(SearchPermitsActions.search({ payload: { query: 'Building Permit', offset: event.pageIndex }}));
  }
}
