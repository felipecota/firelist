import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItemFormComponent } from './item-form/item-form.component';

import { TranslatePipeModule } from '../translate.module'

@NgModule({
  imports: [
    CommonModule, 
    FormsModule,
    TranslatePipeModule
  ],
  exports: [ItemFormComponent],
  declarations: [ItemFormComponent],
})
export class ItemModule { }
