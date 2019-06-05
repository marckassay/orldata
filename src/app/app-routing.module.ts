import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatalogComponent } from './core/components/catalog/catalog.component';
import { HomeComponent } from './core/components/home/home.component';
import { FormTabComponent } from './core/containers/page-viewer/form-tab/form-tab.component';
import { OptionsTabComponent } from './core/containers/page-viewer/options-tab/options-tab.component';
import { PageViewerComponent } from './core/containers/page-viewer/page-viewer.component';
import { TableTabComponent } from './core/containers/page-viewer/table-tab/table-tab.component';

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
    path: 'catalog/:dataset',
    component: PageViewerComponent,
    children: [
      { path: '', redirectTo: 'table', pathMatch: 'full' },
      { path: 'table', component: TableTabComponent, pathMatch: 'full' },
      { path: 'form', component: FormTabComponent, pathMatch: 'full' },
      { path: 'options', component: OptionsTabComponent, pathMatch: 'full' },
      { path: '**', redirectTo: 'table' },
    ],
  },
];

/*    { path: 'form', component: FormTabComponent, pathMatch: 'full' },
      { path: 'options', component: OptionsTabComponent, pathMatch: 'full' }, */

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: true,
    enableTracing: true // <-- debugging purposes only
  })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
