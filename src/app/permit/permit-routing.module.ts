import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormTabComponent } from '@app/core/containers/page-viewer/form-tab/form-tab.component';
import { TableTabComponent } from '@app/core/containers/page-viewer/table-tab/table-tab.component';
import { PermitComponent } from './permit.component';


export const routes: Routes = [
  {
    path: '',
    component: PermitComponent,
    children: [
      { path: '', redirectTo: 'table', pathMatch: 'full' },
      { path: 'table', component: TableTabComponent, pathMatch: 'full' },
      { path: 'form', component: FormTabComponent, pathMatch: 'full' },
      // { path: 'options', component: OptionsTabComponent, pathMatch: 'full' },
      { path: '**', redirectTo: 'table' },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PermitRoutingModule { }
