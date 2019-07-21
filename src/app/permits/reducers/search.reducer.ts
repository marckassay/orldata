import { ISODateString } from '@core/shared/date-converter';
import { createReducer, on } from '@ngrx/store';
import { PermitsApiActions, PermitsFormTabActions } from '@permits/actions';

export interface State {
  /**
   * The application types that the user has selected.
   */
  selectedApplicationTypes: string[] | undefined;

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
  selectedDates: undefined,
  selectedFilterName: undefined,
  distinctApplicationTypes: undefined,
  distinctFilteredNames: undefined,
};

export const reducer = createReducer(
  initialState,
  on(PermitsFormTabActions.updateSelected, (state, {
    selectedApplicationTypes,
    selectedDates,
    selectedFilterName
  }) => ({
    ...state,
    selectedApplicationTypes,
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
  selectedDates: state.selectedDates,
  selectedFilterName: state.selectedFilterName
});
