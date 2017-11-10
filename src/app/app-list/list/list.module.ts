import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListDetailComponent } from './list-detail/list-detail.component';
import { ListFormComponent } from './list-form/list-form.component';
import { ListAccessComponent } from './list-access/list-access.component';

import { TranslatePipeModule } from '../../translate.module'

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
  ]
})
export class ListModule { }
