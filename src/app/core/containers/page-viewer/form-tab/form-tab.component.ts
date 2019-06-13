import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { SearchPermitsActions } from '@permits/actions';
import * as fromSearch from '@permits/reducers';

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
    this.store.dispatch(SearchPermitsActions.search({ payload: { query: '', offset: 0 } }));
  }
}
