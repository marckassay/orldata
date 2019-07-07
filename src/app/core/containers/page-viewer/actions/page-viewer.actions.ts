import { createAction, props } from '@ngrx/store';

export const preloadEntities = createAction(
  '[Page Viewer - Route Resolver] Preload Entities',
  props<{ content: 'permits' | 'crimes' }>()
);

export const preloadDistincts = createAction(
  '[Page Viewer - Route Resolver] Preload Distincts',
  props<{ content: 'permits' | 'crimes' }>()
);
