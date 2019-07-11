import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AngularFireAuth } from '@angular/fire/auth';

import { LoginFormComponent } from './login-form/login-form.component';

import { TranslatePipeModule } from '../translate.module'

@NgModule({
  imports: [
    CommonModule, 
    FormsModule,
    TranslatePipeModule
  ],
  declarations: [LoginFormComponent],
  providers: [AngularFireAuth]
})
export class LoginModule { }
