import { createAction, props } from '@ngrx/store';

export const search = createAction(
  '[Search Permits Submit] Search',
  props<{
    selectedApplicationTypes: {application_type: string[]};
/*     selectedWorkTypes: string[];
    processedDate: Date | undefined;
    processedDateOperator: string;
    secondaryProcessedDate: Date | undefined */
  }>(),
);
