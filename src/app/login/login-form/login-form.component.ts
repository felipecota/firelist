import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { language } from '../../../environments/language';
import { AppService } from '../../app.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  isLoggingIn = true;
  erro: string;   
  t6: string;  
  t7: string;
  t8: string;
  t9: string;

  constructor(
    private afAuth: AngularFireAuth, 
    private router: Router,
    private appService: AppService) { 

    this.t6 = language.t6;
    this.t7 = language.t7;
    this.t8 = language.t8;
    this.t9 = language.t9;   

  }

  ngOnInit() {
    this.afAuth.auth.signOut();
  }

  toggleDisplay() {
    this.isLoggingIn = !this.isLoggingIn;
    this.erro = '';
  }  

  form_login(f: NgForm) {
    if (f.controls.email.value == '' || f.controls.password.value == '')  {
      this.erro = language.e3;
      navigator.vibrate([500]);    
    } else if (f.controls.password.value.length < 6)
      this.erro = language.e5;
    else if (this.isLoggingIn)
      this.afAuth.auth.signInWithEmailAndPassword(
        f.controls.email.value, f.controls.password.value)
        .then(ok => {this.router.navigate(['/list'])})
        .catch(error => {this.erro = language.e4});    
    else
      this.afAuth.auth.createUserWithEmailAndPassword(
        f.controls.email.value, f.controls.password.value)
        .then(ok => {this.router.navigate(['/list'])})
        .catch(error => {this.erro = language.e4});

    f.controls.password.setValue('');
  }

}
