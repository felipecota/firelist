import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AngularFireAuth } from 'angularfire2/auth';

import { LoginFormComponent } from './login-form/login-form.component';

@NgModule({
  imports: [
    CommonModule, 
    FormsModule
  ],
  declarations: [LoginFormComponent],
  providers: [AngularFireAuth]
})
export class LoginModule { }
