import { NgModule } from '@angular/core';
import { PageViewerModule } from '@app/core/containers/page-viewer/page-viewer.component';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { PermitRoutingModule } from './permit-routing.module';
import { PermitComponent } from './permit.component';
import { PermitEffects } from './permit.effects';
import { reducers } from './reducers';

@NgModule({
  imports: [
    PageViewerModule,
    PermitRoutingModule,

    /**
     * StoreModule.forFeature is used for composing state
     * from feature modules. These modules can be loaded
     * eagerly or lazily and will be dynamically added to
     * the existing state.
     */
    StoreModule.forFeature('results', reducers),

    /**
     * Effects.forFeature is used to register effects
     * from feature modules. Effects can be loaded
     * eagerly or lazily and will be started immediately.
     *
     * All Effects will only be instantiated once regardless of
     * whether they are registered once or multiple times.
     */
    EffectsModule.forFeature([PermitEffects]),
  ],
  exports: [PermitComponent],
  declarations: [PermitComponent]
})
export class PermitModule { }
