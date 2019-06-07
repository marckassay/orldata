import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatalogComponent } from './core/components/catalog/catalog.component';
import { HomeComponent } from './core/components/home/home.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'catalog',
    component: CatalogComponent,
    pathMatch: 'full'
  },
  {
    path: 'catalog/permits',
    loadChildren: '@app/permit/permit.module#PermitModule'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: true,
    enableTracing: true // <-- debugging purposes only
  })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
