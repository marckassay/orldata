import { createReducer, on } from '@ngrx/store';
import { PermitsApiActions, SearchPermitsActions } from '@permits/actions';

export interface State {
  /**
   * Maxiumum number of entities rendered in table.
   */
  limit: 20 | 40 | 80 | 160;

  selectedApplicationTypes: { application_type: string[]};
  applicationTypes: Array<{ application_type: string }>;

/*   selectedWorkTypes: string[];
  workTypes: string[];

  processedDate: Date | undefined;
  processedDateOperator: string;
  secondaryProcessedDate: Date | undefined; */
}

const initialState: State = {
  limit: 40,
  selectedApplicationTypes: {application_type: ['']},
  applicationTypes: [],

/*   selectedWorkTypes: [],
  workTypes: [],

  processedDate: undefined,
  processedDateOperator: '',
  secondaryProcessedDate: undefined */
};

export const reducer = createReducer(
  initialState,
  on(SearchPermitsActions.search, (state, {
    selectedApplicationTypes,
/*     selectedWorkTypes,
    processedDate,
    processedDateOperator,
    secondaryProcessedDate */
  }) => ({
    ...state,
    selectedApplicationTypes,
   /*  selectedWorkTypes,
    processedDate,
    processedDateOperator,
    secondaryProcessedDate */
  })),
  on(PermitsApiActions.distinctApplicationTypes, (state, {results}) => ({
    ...state,
      applicationTypes: results
  }))
);

