import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PermitsFormTabActions } from '@app/permits/actions';
import { FormTabComponent } from '@core/containers/page-viewer/form-tab/form-tab.component';
import { CheckGridItem } from '@core/shared/checkbox-grid/checkbox-grid.component';
import { DateConverter, ISODateString } from '@core/shared/date-converter';
import { select, Store } from '@ngrx/store';
import * as fromPermits from '@permits/reducers';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, debounceTime, map, startWith, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'permits-form-tab',
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
export class PermitsFormTabComponent implements OnInit, OnDestroy {

  @ViewChild('orl-form-tab', { static: false })
  orlTab: FormTabComponent;

  applicationTypesEntities: CheckGridItem[] = [];
  private unsubscribe = new Subject<void>();

  form: FormGroup;
  submitValue: any;

  maxDateRangeLimit: Date;
  minDateRangeLimit: Date;

  filteredNames: Observable<string[] | any | undefined>;

  constructor(
    private store: Store<fromPermits.State>,
    private fb: FormBuilder,
    private snackBar: MatSnackBar) {

    this.maxDateRangeLimit = new Date();
    this.minDateRangeLimit = new Date(2000, 0, 1);

    const startDate = new Date();
    const endDate = (date = new Date()): Date => {
      date.setMonth((startDate.getMonth() !== 0) ? startDate.getMonth() - 1 : 11);
      return date;
    };

    this.form = this.fb.group({
      application_types: this.fb.control(this.fb.array([])),
      start_date: this.fb.control(startDate),
      end_date: this.fb.control(endDate()),
      filter_name: this.fb.control('')
    });

    this.onFormChanges();
  }

  get application_types() {
    return this.form.get('application_types') as FormControl;
  }

  get start_date() {
    return this.form.get('start_date') as FormControl;
  }

  get end_date() {
    return this.form.get('end_date') as FormControl;
  }

  get filter_name() {
    return this.form.get('filter_name') as FormControl;
  }

  ngOnInit() {
    this.observeDistinctApplicationTypes();
    this.observeFilteredNames();
    this.observeCount();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onFormChanges() {
    this.form.valueChanges.pipe(
      // TODO: what I want is to emit first immediately and subsequent emissions in a 'window' of
      // time, to be delayed. But this delays all emissions. The link below talks about this:
      // @link https://stackoverflow.com/questions/30140044/deliver-the-first-item-immediately-debounce-following-items
      debounceTime(1000),
      takeUntil(this.unsubscribe)
    ).subscribe(val => {
      this.store.dispatch(PermitsFormTabActions.updateSelected({
        selectedApplicationTypes: this.getSelectedApplicationTypes(),
        selectedDates: this.getSelectedDates(),
        selectedFilterName: this.filter_name.value
      }));
    });
  }

  private observeDistinctApplicationTypes() {
    this.store.pipe(
      select(fromPermits.getDistinctApplicationTypes),
      takeUntil(this.unsubscribe),
      catchError(error => throwError(error))
    ).subscribe((types) => {
      if (types && types.length) {
        types.forEach((type: { application_type: string }) => {

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
        // PermitsFormTabActions.updateSelected and see its effects
        this.form.updateValueAndValidity();
      }
    });
  }

  private observeFilteredNames(): void {
    this.filteredNames = this.store.pipe(
      select(fromPermits.getDistinctFilteredNames),
      map(value => (value === undefined) ? [''] : value),
      startWith(['']),
      takeUntil(this.unsubscribe),
      catchError(error => throwError(error))
    );
  }

  private observeCount(): void {
    this.store.pipe(
      select(fromPermits.getCount),
      takeUntil(this.unsubscribe),
      catchError(error => throwError(error))
    ).subscribe(value => {
      let mesg: string;
      if (value === 0) {
        mesg = 'No permit found.';
      } else if (value === 1) {
        mesg = '1 permit found!';
      } else {
        mesg = value + ' permits found!';
      }
      this.snackBar.open(mesg, undefined, {
        duration: 2000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
    });
  }

  private getSelectedApplicationTypes(): string[] {
    const results = this.application_types.value.value
      .flatMap(
        (currentValue: boolean, index: number) => (currentValue === true) ? this.applicationTypesEntities[index].name : []
      );
    return results;
  }

  private getSelectedDates(): { start: ISODateString, end: ISODateString } {
    return { start: DateConverter.convert(this.start_date.value), end: DateConverter.convert(this.end_date.value) };
  }
}
