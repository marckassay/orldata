import { AfterViewInit, ChangeDetectionStrategy, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { PageViewerComponent } from '@core/containers/page-viewer/page-viewer.component';

@Component({
  selector: 'orl-permits',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <app-page-viewer></app-page-viewer>
  `,
  styles: [
    `orl-permits {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
    }`
  ]
})
export class PermitsComponent implements AfterViewInit {
  // All possible fields for Permits:
  // tslint:disable-next-line: max-line-length
  /* displayedColumns: string[] = ['permit_number', 'application_type', 'parcel_number', 'worktype', 'final_date', 'temp_coo_date', 'coo_date', 'coc_date', 'permit_address', 'property_owner_name', 'parcel_owner_name', 'contractor', 'contractor_name', 'contractor_address', 'contractor_phone_number', 'plan_review_type', 'estimated_cost', 'processed_date', 'under_review_date', 'prescreen_completed_date', 'review_started_date_excluding', 'review_started_including', 'of_cycles', 'of_pdoxwkflw', 'collect_permit_fees_date', 'geocoded_column', 'pending_issuance_date', 'issue_permit_date', 'pdoxbatch_date', 'day_to_issuance']; */

  @ViewChild(PageViewerComponent, { static: false })
  viewer: PageViewerComponent;

  constructor() { }

  ngAfterViewInit() {
  }
}
