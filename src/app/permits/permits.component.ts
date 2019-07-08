import { ChangeDetectionStrategy, Component, NgModule, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ContentName } from '@app/constants';
import { PageViewerModule } from '@app/core/containers/page-viewer/page-viewer.module';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { PermitsEffects } from '@permits/permits.effects';
import { reducers } from '@permits/reducers';

@Component({
  selector: 'orl-permit-viewer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-viewer></app-page-viewer>
  `,
  encapsulation: ViewEncapsulation.None
})
export class PermitsComponent {
  // All possible fields for Permits:
  // tslint:disable-next-line: max-line-length
  /* displayedColumns: string[] = ['permit_number', 'application_type', 'parcel_number', 'worktype', 'final_date', 'temp_coo_date', 'coo_date', 'coc_date', 'permit_address', 'property_owner_name', 'parcel_owner_name', 'contractor', 'contractor_name', 'contractor_address', 'contractor_phone_number', 'plan_review_type', 'estimated_cost', 'processed_date', 'under_review_date', 'prescreen_completed_date', 'review_started_date_excluding', 'review_started_including', 'of_cycles', 'of_pdoxwkflw', 'collect_permit_fees_date', 'geocoded_column', 'pending_issuance_date', 'issue_permit_date', 'pdoxbatch_date', 'day_to_issuance']; */
  constructor(
    public router: Router,
    public route: ActivatedRoute) {
  }
}

@NgModule({
  imports: [
    PageViewerModule,
    RouterModule.forChild([{ path: '', component: PermitsComponent }]),

    /**
     * StoreModule.forFeature is used for composing state
     * from feature modules. These modules can be loaded
     * eagerly or lazily and will be dynamically added to
     * the existing state.
     */
    StoreModule.forFeature(ContentName.Permits, reducers),

    /**
     * Effects.forFeature is used to register effects
     * from feature modules. Effects can be loaded
     * eagerly or lazily and will be started immediately.
     *
     * All Effects will only be instantiated once regardless of
     * whether they are registered once or multiple times.
     */
    EffectsModule.forFeature([PermitsEffects]),
  ],
  exports: [
    PermitsComponent
  ],
  declarations: [
    PermitsComponent
  ]
})
export class PermitsModule { }
