import { createAction, props } from '@ngrx/store';

export const search = createAction(
  '[Search Permits Submit] Search',
  props<{
    /**
     * A value of `-1` indicates that this action is requesting a count only of number of records.
     * Any value above `-1` indicates a non-count query.
     */
    offset: number;
    selectedApplicationTypes: {application_type: string[]};
    /*
    selectedWorkTypes: string[];
    processedDate: Date | undefined;
    processedDateOperator: string;
    secondaryProcessedDate: Date | undefined
    */
  }>(),
);
