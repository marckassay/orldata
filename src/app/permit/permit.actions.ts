import { createAction, props } from '@ngrx/store';

const PREFIX = '[Get Permits] ';

export const searchFilteredPermits = createAction(
  PREFIX + 'Filtered Permits',
  props<{filter: string; offset: number; }>(),
);

export const getDistinctApplicationTypes = createAction(
  PREFIX + 'Distinct Application Types',
);
