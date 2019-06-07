import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { SearchPermitsActions } from '@app/permit/actions';
import * as fromSearch from '@app/permit/reducers';
import { Store } from '@ngrx/store';

@Component({
  selector: 'orl-form-tab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'form-tab.html',
  encapsulation: ViewEncapsulation.None
})
export class FormTabComponent {

  constructor(private store: Store<fromSearch.State>) {

  }

  search() {
    this.store.dispatch(SearchPermitsActions.queryPermits({ payload: { query: '', offset: 0 } }));
  }
}
