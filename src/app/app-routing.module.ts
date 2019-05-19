import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/permit',
    pathMatch: 'full'
  },
  {
    path: 'permit',
    loadChildren: './permit/permit.module#PermitModule'
  },
  {
    path: 'search',
    loadChildren: './search/search.module#SearchModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,
    {
      relativeLinkResolution: 'legacy',
      enableTracing: true, // <-- debugging purposes only
      initialNavigation: false
    })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
