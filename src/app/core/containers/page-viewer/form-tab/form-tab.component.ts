import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromPermits from '@permits/reducers';
import { of } from 'rxjs';

interface FlexGridItem {
  id: string;
  checked: boolean;
  application_type: string;
}

export function minSelectedCheckboxes(min = 1) {
  const validator: ValidatorFn | any = (formArray: FormArray) => {
    const totalSelected = formArray.controls
      .map(control => control.value)
      .reduce((prev, next) => next ? prev + next : prev, 0);

    return totalSelected >= min ? null : { required: true };
  };

  return validator;
}

@Component({
  selector: 'orl-form-tab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'form-tab.html',
  encapsulation: ViewEncapsulation.None,
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
export class FormTabComponent implements OnInit, AfterViewInit {

  /*  @ViewChild(FlexGridComponent, { static: false })
   applicationTypeGrid: FlexGridComponent<FlexGridItem>; */
  form: FormGroup | undefined;
  // tslint:disable-next-line: variable-name
  application_types: FlexGridItem[];


  constructor(private store: Store<fromPermits.State>,
              private fb: FormBuilder) { }

  ngOnInit() {
    this.form = this.fb.group({
      application_types: this.fb.array([], minSelectedCheckboxes(1))
    });

    /*     this.store.pipe(
          select(fromPermits.getApplicationTypes),
          catchError(error => throwError(error))
        ) */

    of([
      { application_type: 'Building Permit' },
      { application_type: 'Gas' },
      { application_type: 'FloodPlan' },
      { application_type: 'Alcohol' },
    ]).subscribe((types) => {
      const building: FlexGridItem[] = [];
      types.forEach((type: { application_type: string }) => {
        const part = Object.assign({ id: '', checked: (type.application_type === 'Building Permit'), application_type: '' }, type);
        part.id = part.application_type.toLowerCase().replace(/ /gi, '_');
        building.push(part);
      });
      this.application_types = building;
      this.addCheckboxes();
    });

    /*
    this.store.pipe(select(fromPermits.getSelectedApplicationTypes));

    this.store.pipe(select(fromPermits.getWorkTypes));
    this.store.pipe(select(fromPermits.getSelectedWorkTypes));

    this.store.pipe(select(fromPermits.getProcessedDate));
    this.store.pipe(select(fromPermits.getProcessedDateOperator));
    this.store.pipe(select(fromPermits.getSecondaryProcessedDate));
    */
  }

  ngAfterViewInit() {

  }

  private addCheckboxes() {
    this.application_types.forEach((o, i) => {
      if (this.form) {
        const control = new FormControl(o.checked === true);
        (this.form.controls.application_types as FormArray).push(control);
      }
    });
  }

  selectAll() {
    if (this.form) {
      const ctrlsArray = this.form.get('application_types') as FormArray;
      if (ctrlsArray) {
        (ctrlsArray.controls as FormControl[]).forEach((control) => {
          control.setValue(true);
        });
      }
    }
  }

  clearAll() {
    if (this.form) {
      const ctrlsArray = this.form.get('application_types') as FormArray;
      if (ctrlsArray) {
        (ctrlsArray.controls as FormControl[]).forEach((control) => {
          control.setValue(false);
        });
      }
    }
  }

  submit() {
    if (this.form) {
      const values = this.form.value.application_types
        .map((value: boolean, i: number) => value ? this.application_types[i].id : null)
        .filter((id: string) => id !== null);
      console.log(values);
    }

    // this.store.dispatch(SearchPermitsActions.search({}));
  }
}
