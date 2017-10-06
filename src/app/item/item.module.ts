import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItemFormComponent } from './item-form/item-form.component';

@NgModule({
  imports: [
    CommonModule, 
    FormsModule
  ],
  exports: [ItemFormComponent],
  declarations: [ItemFormComponent],
})
export class ItemModule { }
