import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SearchPermitsActions } from '@app/permit/actions';
import * as fromResults from '@app/permit/reducers';
import { select, Store } from '@ngrx/store';
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
  dataSource: Observable<object>;

  resultsLength = 0;
  isLoadingResults: Observable<boolean>;
  isRateLimitReached = false;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(public store: Store<fromResults.State>) {

  }

  ngOnInit() {
    this.dataSource = this.store.pipe(select(fromResults.getPermitEntitiesState));
    this.isLoadingResults = this.store.pipe(select(fromResults.getSearchLoading));
/*       .subscribe((next) => {
          this.dataSource = new MatTableDataSource(next);
    }); */
  }

  ngAfterViewInit() {
    this.store.dispatch(SearchPermitsActions.queryPermits({ payload: { query: '', offset: 0 } }));
  }

  pageChange(event: PageEvent) {
   // this.store.dispatch(PermitActions.searchFilteredPermits({payload: {filter: '', offset: event.pageIndex}}));
  }
}
