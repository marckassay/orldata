import { createReducer, on } from '@ngrx/store';
import { PermitsApiActions, SearchPermitsActions } from '@permits/actions';

export interface State {
  /**
   * Maxiumum number of entities rendered in table.
   */
  limit: 20 | 40 | 80 | 160;

  selectedApplicationTypes: string[];
  applicationTypes: Array<{ name: string, checked: boolean }>;

  selectedWorkTypes: string[];
  workTypes: string[];

  processedDate: Date | undefined;
  processedDateOperator: string;
  secondaryProcessedDate: Date | undefined;
}

const initialState: State = {
  limit: 40,
  selectedApplicationTypes: [],
  applicationTypes: [],

  selectedWorkTypes: [],
  workTypes: [],

  processedDate: undefined,
  processedDateOperator: '',
  secondaryProcessedDate: undefined
};

export const reducer = createReducer(
  initialState,
  on(SearchPermitsActions.search, (state, {
    selectedApplicationTypes,
    selectedWorkTypes,
    processedDate,
    processedDateOperator,
    secondaryProcessedDate
  }) => ({
    ...state,
    selectedApplicationTypes,
    selectedWorkTypes,
    processedDate,
    processedDateOperator,
    secondaryProcessedDate
  })),
  on(PermitsApiActions.distinctApplicationTypes, (state, {results}) => {
    const fresults = (results).map((value) => {
      return { name: value.application_type, checked: false};
    });
    return {
    ...state,
      applicationTypes: fresults
    };
  })
);
