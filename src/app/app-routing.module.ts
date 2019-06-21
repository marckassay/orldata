import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: '@core/components/home/home.component#HomeModule',
    data: { title: 'Home' }
  },
  {
    path: 'catalog',
    loadChildren: '@core/components/catalog/catalog.component#CatalogModule',
    pathMatch: 'full',
    data: { title: 'Catalog' }
  },
  {
    path: 'catalog/permits',
    loadChildren: '@permits/permits.component#PermitsModule',
    data: { title: 'Permits' }
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      enableTracing: true, // <-- debugging purposes only
      relativeLinkResolution: 'corrected'
    })
  ],
  exports: [
    RouterModule
  ],
})
export class AppRoutingModule { }
