import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from '../material.module';
import { PermitComponent } from './permit.component';

const routes: Routes = [
  {
    path: '',
    component: PermitComponent
  }
];

@NgModule({
  declarations: [PermitComponent],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule.forChild(routes)
  ]
})
export class PermitModule { }
