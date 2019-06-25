import { createReducer, on } from '@ngrx/store';
import { PermitsApiActions, SearchPermitsActions } from '@permits/actions';

export interface State {
  // TODO: urgent; remove this nested object; application_type
  selectedApplicationTypes: string[];
  applicationTypes: Array<{ application_type: string }>;

/*   selectedWorkTypes: string[];
  workTypes: string[];

  processedDate: Date | undefined;
  processedDateOperator: string;
  secondaryProcessedDate: Date | undefined; */
}

const initialState: State = {
  selectedApplicationTypes: [''],
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
    selectedState: selectedApplicationTypes,
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

export const getSelected = (state: State) => ({ selectedApplicationTypes: state.selectedApplicationTypes });
