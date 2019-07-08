import { ContentName } from '@app/constants';
import { createAction, props } from '@ngrx/store';

export const preloadEntities = createAction(
  '[Page Viewer - Route Resolver] Preload Entities',
  props<{ content: ContentName }>()
);

export const preloadDistincts = createAction(
  '[Page Viewer - Route Resolver] Preload Distincts',
  props<{ content: ContentName }>()
);
