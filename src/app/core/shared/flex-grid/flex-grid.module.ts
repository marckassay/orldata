import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { FlexGridComponent } from './flex-grid.component';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSelectModule,
    MatGridListModule,
    MatCheckboxModule,
    MatFormFieldModule,
    CommonModule
  ],
  exports: [
    FlexGridComponent
  ],
  declarations: [
    FlexGridComponent
  ]
})
export class FlexGridModule { }
