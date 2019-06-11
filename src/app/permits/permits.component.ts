import { ChangeDetectionStrategy, Component, NgModule, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PageViewerModule } from '@app/core/containers/page-viewer/page-viewer.component';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { PermitsEffects } from './permits.effects';
import { reducers } from './reducers';

@Component({
  selector: 'orl-permit-viewer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-viewer></app-page-viewer>
  `,
  encapsulation: ViewEncapsulation.None
})
export class PermitsComponent {

  constructor(public router: Router,
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
    StoreModule.forFeature('permits', reducers),

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
