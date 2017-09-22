import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule }   from '@angular/router';

import { ItemComponent } from './item.component';
import { FormComponent } from './form/form.component';
import { ListComponent } from './list/list.component';
import { AngularFireDatabase } from 'angularfire2/database';

@NgModule({
  imports: [
    CommonModule, 
    FormsModule,
    RouterModule.forRoot([
      { 
        path: '', 
        redirectTo: '/list', 
        pathMatch: 'full' 
      },
      {
        path: 'list',
        component: ListComponent
      },
      {
        path: 'form',
        component: FormComponent
      }      
    ])      
  ],
  providers:[AngularFireDatabase],
  exports: [FormComponent, ListComponent, ItemComponent],
  declarations: [FormComponent, ListComponent, ItemComponent]
})
export class ItemModule { }
