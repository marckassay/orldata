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

  // tslint:disable-next-line: max-line-length
  /*   displayedColumns: string[] = ['permit_number', 'application_type', 'parcel_number', 'worktype', 'final_date', 'temp_coo_date', 'coo_date', 'coc_date', 'permit_address', 'property_owner_name', 'parcel_owner_name', 'contractor', 'contractor_name', 'contractor_address', 'contractor_phone_number', 'plan_review_type', 'estimated_cost', 'processed_date', 'under_review_date', 'prescreen_completed_date', 'review_started_date_excluding', 'review_started_including', 'of_cycles', 'of_pdoxwkflw', 'collect_permit_fees_date', 'geocoded_column', 'pending_issuance_date', 'issue_permit_date', 'pdoxbatch_date', 'day_to_issuance']; */
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
