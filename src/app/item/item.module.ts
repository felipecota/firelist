import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { FormComponent } from './form/form.component';
import { ListComponent } from './list/list.component';

@NgModule({
  imports: [
    CommonModule, 
    FormsModule
  ],
  exports: [FormComponent, ListComponent],
  declarations: [FormComponent, ListComponent],
})
export class ItemModule { }
