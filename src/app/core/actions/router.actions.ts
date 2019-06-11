import { createAction } from '@ngrx/store';


export const permitsDatasetStartup = createAction(
  '[RouterEffects] Permits Dataset Startup',
);

export const crimesDatasetStartup = createAction(
  '[RouterEffects] Crimes Dataset Startup',
);
