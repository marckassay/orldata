import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { SearchPermitsActions } from '@permits/actions';
import * as fromPermits from '@permits/reducers';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface CheckGridItem {
  id: string;
  checked: boolean;
  name: string;
}

@Component({
  selector: 'orl-form-tab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
  <div class="orl-search-container">
    <form [formGroup]="form" (ngSubmit)="onSubmit(form.value)" novalidate>
      <orl-check-grid
        title="Application Types"
        [formControl]="application_types"
        [dataProvider]="applicationTypesEntities">
      </orl-check-grid>
      <div class="orl-button-row">
        <button mat-stroked-button [disabled]="!form.valid" class="orl-button" color="primary" >Search</button>
      </div>
    </form>
  </div>
  `,
  styles: [`
  .orl-search-container {
    display: flex;
    flex-direction: column;
  }

  .orl-search-container > * {

  }
  .orl-valid-div {
    margin: 14px 0;
    p {
      font-weight: bold;
    }
  }
  .orl-search-section {
    display: flex;
    align-content: center;
    align-items: center;
  }

  .orl-search-margin {
    margin: 0 10px;
  }

  .orl-button-row button,
  .orl-button-row a {
    margin-top: 16px;
    margin-right: 8px;
  }

  p {
    font-size: 14px;
  }

  .mat-grid-tile {
    font-weight: unset;
  }

  .mat-grid-tile .mat-figure {
    justify-content: start;
  }
  `]
})
export class FormTabComponent implements OnInit {
  applicationTypesEntities: CheckGridItem[] = [];

  form: FormGroup;
  submitValue: any;

  constructor(private store: Store<fromPermits.State>,
              private fb: FormBuilder) {
    this.form = this.fb.group({
      application_types: this.fb.control(this.fb.array([])),
    });

  }

  get application_types() {
    return this.form.get('application_types') as FormControl;
  }

  ngOnInit() {
    this.observeApplicationTypes();
  }

  private observeApplicationTypes() {
    this.store.pipe(
      select(fromPermits.getApplicationTypes),
      catchError(error => throwError(error))
    ).subscribe((types) => {
      types.forEach((type: { application_type: string }) => {

        // TODO: store in this class
        const part: CheckGridItem = {
          id: type.application_type.toLowerCase().replace(/ /gi, '_'),
          checked: (type.application_type === 'Building Permit'),
          name: type.application_type
        };

        const control = new FormControl(part.checked === true);
        this.applicationTypesEntities.push(part);
        (this.application_types.value as FormArray).push(control);
      });
    });
  }

  /*
  this.store.pipe(select(fromPermits.getSelectedApplicationTypes));

  this.store.pipe(select(fromPermits.getWorkTypes));
  this.store.pipe(select(fromPermits.getSelectedWorkTypes));

  this.store.pipe(select(fromPermits.getProcessedDate));
  this.store.pipe(select(fromPermits.getProcessedDateOperator));
  this.store.pipe(select(fromPermits.getSecondaryProcessedDate));
  */

  onSubmit(value: any) {
    const selectApplicationTypes = () => {
      const types = value.application_types.value
      .flatMap(
        (currentValue: boolean, index: number) => (currentValue === true) ? this.applicationTypesEntities[index].name : []
      );

      return { application_type: types};
    };

    this.store.dispatch(SearchPermitsActions.search({ selectedApplicationTypes: selectApplicationTypes()}));
  }
}
