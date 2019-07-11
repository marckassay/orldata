import { AfterContentInit, ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromPermits from '@permits/reducers';

@Component({
  selector: 'orl-permits',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <router-outlet></router-outlet>
  `,
  styles: [
    `orl-permits {
      min-height: 100%;
      margin-bottom: -139px;
    }`
  ]
})
export class PermitsComponent implements AfterContentInit {
  // All possible fields for Permits:
  // tslint:disable-next-line: max-line-length
  /* displayedColumns: string[] = ['permit_number', 'application_type', 'parcel_number', 'worktype', 'final_date', 'temp_coo_date', 'coo_date', 'coc_date', 'permit_address', 'property_owner_name', 'parcel_owner_name', 'contractor', 'contractor_name', 'contractor_address', 'contractor_phone_number', 'plan_review_type', 'estimated_cost', 'processed_date', 'under_review_date', 'prescreen_completed_date', 'review_started_date_excluding', 'review_started_including', 'of_cycles', 'of_pdoxwkflw', 'collect_permit_fees_date', 'geocoded_column', 'pending_issuance_date', 'issue_permit_date', 'pdoxbatch_date', 'day_to_issuance']; */
  /*   @ViewChild(PageViewerComponent, { static: false })
    viewer: PageViewerComponent;
   */
  constructor(protected store: Store<fromPermits.State>) {
    console.log('!!!!!!!!! PermitsComponent construct !!!!!!!!!!');
  }

  ngAfterContentInit() {
    /*    this.viewer.count = this.store.pipe(
         select(fromPermits.getCount),
         startWith(0)
       ); */
  }
}
