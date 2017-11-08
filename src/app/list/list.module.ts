import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListDetailComponent } from './list-detail/list-detail.component';
import { ListFormComponent } from './list-form/list-form.component';

import { TranslatePipeModule } from '../translate.module'

import { ListAccessComponent } from './list-access/list-access.component';

@NgModule({
  declarations: [
    ListDetailComponent, 
    ListFormComponent,
    ListAccessComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    TranslatePipeModule
  ],
  exports: [
    ListDetailComponent, 
    ListFormComponent
  ]
})
export class ListModule { }
