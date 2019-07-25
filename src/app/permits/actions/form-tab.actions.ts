import { RadioGroupTime } from '@app/constants';
import { ISODateString } from '@core/shared/date-converter';
import { createAction, props } from '@ngrx/store';

export const updateSelected = createAction(
  '[Permits Form Tab] Update Selected',
  props<{
    selectedApplicationTypes: string[];
    selectedRadioGroupTime: RadioGroupTime | undefined;
    selectedDates: { start: ISODateString, end: ISODateString };
    selectedFilterName: string;
  }>()
);
