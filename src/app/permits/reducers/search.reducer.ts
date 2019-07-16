import { ISODateString } from '@core/shared/iso-date-string';
import { createReducer, on } from '@ngrx/store';
import { PermitsApiActions, PermitsFormTabActions } from '@permits/actions';

export interface State {
  /**
   * The application types that the user has selected.
   */
  selectedApplicationTypes: string[] | undefined;

  selectedDates: { start: ISODateString, end: ISODateString } | undefined;

  /**
   * The distinct collection of application types (determined by response data from service query).
   */
  distinctApplicationTypes: { application_type: string }[] | undefined;
}

const initialState: State = {
  selectedApplicationTypes: undefined,
  selectedDates: undefined,
  distinctApplicationTypes: undefined,
};

export const reducer = createReducer(
  initialState,
  on(PermitsFormTabActions.updateSelected, (state, {
    selectedApplicationTypes,
    selectedDates,
  }) => ({
    ...state,
    selectedApplicationTypes,
    selectedDates
  })),
  on(PermitsApiActions.distinctApplicationTypes, (state, { results }) => ({
    ...state,
    distinctApplicationTypes: results
  }))
);

/**
 * As with other `getSelected()`, returns all variables that the user can adjust on this page.
 */
export const getSelected = (state: State) => ({
  selectedApplicationTypes: state.selectedApplicationTypes,
  selectedDates: state.selectedDates
});
