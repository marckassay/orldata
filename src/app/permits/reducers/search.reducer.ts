import { RadioGroupTime } from '@app/constants';
import { ISODateString } from '@core/shared/date-converter';
import { createReducer, on } from '@ngrx/store';
import { PermitsApiActions, PermitsFormTabActions } from '@permits/actions';

export interface State {
  /**
   * The application types that the user has selected.
   */
  selectedApplicationTypes: string[] | undefined;

  /**
   * If defined, it is of consequence to the value of `selectedDates`. A value of `undefined`
   * indicates that the user has set date value using the `mat-datepicker` and not `mat-radio-group`
   */
  selectedRadioGroupTime: RadioGroupTime | undefined;

  selectedDates: { start: ISODateString, end: ISODateString } | undefined;

  selectedFilterName: string | undefined;

  /**
   * The distinct collection of application types (determined by response data from service query).
   */
  distinctApplicationTypes: { application_type: string }[] | undefined;

  distinctFilteredNames: object[] | undefined;
}

const initialState: State = {
  selectedApplicationTypes: undefined,
  selectedRadioGroupTime: RadioGroupTime['Past month'],
  selectedDates: undefined,
  selectedFilterName: undefined,
  distinctApplicationTypes: undefined,
  distinctFilteredNames: undefined,
};

export const reducer = createReducer(
  initialState,
  on(PermitsFormTabActions.updateSelected, (state, {
    selectedApplicationTypes,
    selectedRadioGroupTime,
    selectedDates,
    selectedFilterName
  }) => ({
    ...state,
    selectedApplicationTypes,
    selectedRadioGroupTime,
    selectedDates,
    selectedFilterName
  })),
  on(PermitsApiActions.updateDistinctTypesSuccess, (state, { results }) => ({
    ...state,
    distinctApplicationTypes: results
  })),
  on(PermitsApiActions.updateDistinctNamesSuccess, (state, results) => ({
    ...state,
    ...results
  }))
);

/**
 * As with other `getSelected()`, returns all variables that the user can adjust on this page.
 */
export const getSelected = (state: State) => ({
  selectedApplicationTypes: state.selectedApplicationTypes,
  selectedRadioGroupTime: state.selectedRadioGroupTime,
  selectedDates: state.selectedDates,
  selectedFilterName: state.selectedFilterName
});
