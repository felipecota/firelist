import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BillFormComponent } from './bill-form/bill-form.component';
import { BillAccessComponent } from './bill-access/bill-access.component';
import { BillItemComponent } from './bill-item/bill-item.component';

import { TranslatePipeModule } from '../../translate.module'

@NgModule({
  declarations: [
    BillFormComponent,
    BillAccessComponent,
    BillItemComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    TranslatePipeModule
  ]
})
export class BillModule { }