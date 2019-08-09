import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsFormComponent } from './settings-form/settings-form.component';
import { TranslatePipeModule } from '../translate.module'

@NgModule({
  imports: [
    CommonModule,
    TranslatePipeModule
  ],
  declarations: [SettingsFormComponent]
})

export class SettingsModule { }
