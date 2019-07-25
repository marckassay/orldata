import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { RadioGroupTimeMap, SnackBarActions } from '@app/constants';
import { PermitsFormTabActions } from '@app/permits/actions';
import * as fromRoot from '@app/reducers';
import { getDateFromRadioGroupTime, getDateOneMonthAgo, getISODateFromRadioGroupTime, getToday } from '@app/utils';
import { FormTabComponent } from '@core/containers/page-viewer/form-tab/form-tab.component';
import { CheckGridItem } from '@core/shared/checkbox-grid/checkbox-grid.component';
import { DateConverter, ISODateString } from '@core/shared/date-converter';
import { select, Store } from '@ngrx/store';
import * as fromPermits from '@permits/reducers';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, debounceTime, filter, map, mergeMap, skip, startWith, take, takeUntil, withLatestFrom } from 'rxjs/operators';

@Component({
  selector: 'permits-form-tab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: 'form-tab.html',
  styleUrls: ['form-tab.scss']
})
export class PermitsFormTabComponent implements OnInit, OnDestroy {

  @ViewChild('orl-form-tab', { static: false })
  orlTab: FormTabComponent;

  applicationTypesEntities: CheckGridItem[] = [];
  private unsubscribe = new Subject<void>();

  form: FormGroup;
  submitValue: any;

  timeframes = RadioGroupTimeMap;

  maxDateRangeLimit: Date;
  minDateRangeLimit: Date;

  filteredNames: Observable<string[] | any | undefined>;

  constructor(
    private store: Store<fromPermits.State>,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {

    this.maxDateRangeLimit = new Date();
    this.minDateRangeLimit = new Date(2000, 0, 1);

    const startDate = getToday();
    const endDate = getDateOneMonthAgo();

    this.form = this.fb.group({
      application_types: this.fb.control(this.fb.array([])),
      radio_date_selection: this.fb.control(undefined),
      start_date: this.fb.control(startDate),
      end_date: this.fb.control(endDate),
      filter_name: this.fb.control('')
    });

    this.onFormChanges();
  }

  get application_types() {
    return this.form.get('application_types') as FormControl;
  }

  get radio_date_selection() {
    return this.form.get('radio_date_selection') as FormControl;
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
    this.observeRadioGroupTime();
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
    ).subscribe(() => {

      // When radioGroup UI changes, it will programatically set `start_date` and/or `end_date`. The
      // event will porporgate a here with `start_date` as `end_date` pristine (not dirty). Only when
      // the `start_date` or `end_date` changes in the UI, will the event that gets porporgated here
      // will have them set to dirty. If so, set them to `markAsPristine()` and 'clear' radio_date_selection
      // so that the state reflects that the user last interacted with one of the DatePickers.
      const radioGroupValue = this.radio_date_selection.value;
      if (this.start_date.dirty || this.end_date.dirty) {
        this.start_date.markAsPristine();
        this.end_date.markAsPristine();
        if (typeof radioGroupValue !== 'undefined') {
          this.radio_date_selection.setValue(undefined, { onlySelf: true, emitEvent: false });
        }
      }

      this.store.dispatch(PermitsFormTabActions.updateSelected({
        selectedApplicationTypes: this.getSelectedApplicationTypes(),
        selectedRadioGroupTime: this.radio_date_selection.value,
        selectedDates: this.getISOSelectedDates(),
        selectedFilterName: this.filter_name.value
      }));

    });
  }

  private observeRadioGroupTime() {

    this.store.pipe(
      select(fromPermits.getSelectedRadioGroupTime),
      take(1),
      catchError(error => throwError(error))
    ).subscribe((value) => {
      const val = (typeof value !== 'undefined') ? value.toString() : undefined;
      this.radio_date_selection.setValue(val, { onlySelf: true, emitEvent: false });
    });

    this.radio_date_selection.valueChanges.pipe(
      takeUntil(this.unsubscribe),
      catchError(error => throwError(error))
    ).subscribe((value) => {
      if (typeof value !== 'undefined') {
        const { start, end } = this.getSelectedDates();
        this.start_date.setValue(start, { onlySelf: true, emitEvent: false, emitModelToViewChange: true, emitViewToModelChange: true });
        this.end_date.setValue(end, { onlySelf: true, emitEvent: false, emitModelToViewChange: true, emitViewToModelChange: true });
      }
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
    // Observing `getLastResponseTime` will still be triggered when the route is on this component
    // or not. Typically that may not be a problem, but since snackBar is shown regardless of where
    // it was called, this is why the `filter()` is here.
    this.store.select(fromPermits.getLastResponseTime).pipe(
      mergeMap(() => this.store.select(fromRoot.selectUrl)),
      filter((url) => url === '/catalog/permits/form'),
      skip(1),
      withLatestFrom(this.store.select(fromPermits.getCount)),
      map((value) => value[1]),
      takeUntil(this.unsubscribe),
      catchError(error => throwError(error))
    ).subscribe(value => this.launchSnackBar(value));
  }

  private getSelectedApplicationTypes(): string[] {
    const results = this.application_types.value.value
      .flatMap(
        (currentValue: boolean, index: number) => (currentValue === true) ? this.applicationTypesEntities[index].name : []
      );
    return results;
  }

  private getSelectedDates(): { start: Date, end: Date } {
    const radioGroupValue: Date | undefined = getDateFromRadioGroupTime(this.radio_date_selection.value) as Date | undefined;
    if (typeof radioGroupValue !== 'undefined') {
      return { start: getToday() as Date, end: radioGroupValue as Date };
    } else {
      return { start: this.start_date.value as Date, end: this.end_date.value as Date };
    }
  }

  private getISOSelectedDates(): { start: ISODateString, end: ISODateString } {
    const radioGroupValue: ISODateString | undefined = getISODateFromRadioGroupTime(this.radio_date_selection.value);
    if (radioGroupValue) {
      return { start: getToday(true) as ISODateString, end: radioGroupValue };
    } else {
      return { start: DateConverter.convert(this.start_date.value), end: DateConverter.convert(this.end_date.value) };
    }
  }

  private launchSnackBar(count: number): void {
    let mesg: string;
    if (count === 0) {
      mesg = 'No permit found.';
    } else if (count === 1) {
      mesg = '1 permit found!';
    } else {
      mesg = count + ' permits found!';
    }

    const action = (count > 0) ? SnackBarActions[0] : SnackBarActions[1];
    const currentSnackBar = this.snackBar.open(mesg, (action as keyof typeof SnackBarActions), {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
    currentSnackBar.onAction().pipe(
      take(1),
      takeUntil(this.unsubscribe),
    ).subscribe(() => {
      if (action === SnackBarActions[0]) {
        currentSnackBar.dismissWithAction();
      }
    });
    currentSnackBar.afterDismissed().pipe(
      take(1),
      takeUntil(this.unsubscribe)
    ).subscribe((x) => {
      if (x.dismissedByAction === true) {
        this.router.navigate(['table'], { relativeTo: this.activatedRoute }).then(() => {
          this.snackBar.dismiss();
        });
      }
    });
  }
}
