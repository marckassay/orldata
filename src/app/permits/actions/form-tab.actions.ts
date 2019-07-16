import { ISODateString } from '@core/shared/iso-date-string';
import { createAction, props } from '@ngrx/store';

export const updateSelected = createAction(
  '[Permits Form Tab] Update Selected',
  props<{
    selectedApplicationTypes: string[];
    selectedDates: { start: ISODateString, end: ISODateString };
  }>()
);
