import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { PermitsFormTabActions } from '@app/permits/actions';
import { select, Store } from '@ngrx/store';
import * as fromPermits from '@permits/reducers';
import { interval, Subject, throwError } from 'rxjs';
import { catchError, debounce, takeUntil } from 'rxjs/operators';

export interface CheckGridItem {
  id: string;
  checked: boolean;
  name: string;
}

@Component({
  selector: 'orl-form-tab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: 'form-tab.html',
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
export class FormTabComponent implements OnInit, OnDestroy {
  applicationTypesEntities: CheckGridItem[] = [];
  private unsubscribe = new Subject<void>();

  form: FormGroup;
  submitValue: any;

  constructor(
    private store: Store<fromPermits.State>,
    private fb: FormBuilder) {
    this.form = this.fb.group({
      application_types: this.fb.control(this.fb.array([]))
    });

    this.onFormChanges();
  }

  get application_types() {
    return this.form.get('application_types') as FormControl;
  }

  ngOnInit() {
    this.observeApplicationTypes();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onFormChanges() {
    this.form.valueChanges.pipe(
      debounce(() => interval(1000)),
      takeUntil(this.unsubscribe)
    ).subscribe(val => {
      this.store.dispatch(PermitsFormTabActions.updateSelected({ selectedApplicationTypes: this.selectApplicationTypes() }));
    });
  }

  private observeApplicationTypes() {
    this.store.pipe(
      select(fromPermits.getDistinctApplicationTypes),
      takeUntil(this.unsubscribe),
      catchError(error => throwError(error))
    ).subscribe((types) => {
      if (types && types.length) {
        types.forEach((type: { application_type: string }) => {

          // TODO: store in this class
          const part: CheckGridItem = {
            id: type.application_type.toLowerCase().replace(/ /gi, '_'),
            checked: (type.application_type === 'Building Permit'),
            name: type.application_type
          };

          // TODO: reason for passing 2 arrays into orl-checkbox-grid is because I'm unaware of
          // passing an object in mat-checkbox. It seems it only can take a boolean. Because of this
          // applicationTypesEntities is used in mapping with application_types to determine what has
          // changed. This is done in `selectApplicationTypes()`
          const control = new FormControl(part.checked === true);
          this.applicationTypesEntities.push(part);
          (this.application_types.value as FormArray).push(control);
        });

        // since using a resolver that dispatches an action, this is needed to dispatch
        // PermitsFormTabActions.search and see its effects
        this.form.updateValueAndValidity();
      }
    });
  }

  private selectApplicationTypes(): string[] {
    const results = this.application_types.value.value
      .flatMap(
        (currentValue: boolean, index: number) => (currentValue === true) ? this.applicationTypesEntities[index].name : []
      );
    return results;
  }
}
