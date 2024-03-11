import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsFormComponent } from './settings-form/settings-form.component';
import { TranslatePipeModule } from '../translate.module';
import { DeleteFormComponent } from './delete-form/delete-form.component'

@NgModule({
  imports: [
    FormsModule,
    CommonModule,    
    TranslatePipeModule
  ],
  declarations: [SettingsFormComponent, DeleteFormComponent]
})

export class SettingsModule { }
