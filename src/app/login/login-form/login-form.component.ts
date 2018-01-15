import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';

import { AppService } from '../../app.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  isLoggingIn = true;
  erro: string;  
  email: string; 
  password: string;

  constructor(
    private afAuth: AngularFireAuth, 
    private appService: AppService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  toggleDisplay() {
    this.isLoggingIn = !this.isLoggingIn;
    this.erro = '';
  }  

  loginWithFacebook() {
      this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider())
      .then(ok => {})
      .catch(error => {
        this.afAuth.auth.fetchProvidersForEmail(error.email)
        .then(providers => {
          this.afAuth.auth.signInWithCredential(error.credential)   
          .then(result => {
            console.log("passei");
            result.user.link(error.credential)
          })
          .catch(error => console.log('error2', error))     
        })
        console.log('error1', error);
      });
  }

  login() {
    if (!this.email || !this.password)  {
      this.erro = this.appService.language.e3;
      navigator.vibrate([500]);    
    } else if (this.isLoggingIn)
      this.afAuth.auth.signInWithEmailAndPassword(
        this.email, this.password)
        .then(ok => { })
        .catch(error => {
          this.erro = this.appService.language.e4
        });    
    else
      this.afAuth.auth.createUserWithEmailAndPassword(
        this.email, this.password)
        .then(ok => {})
        .catch(error => {
          this.erro = this.appService.language.e4; 
        });
  } 

  forgot() {
    if (!this.email)  {
      this.erro = this.appService.language.e3;
      navigator.vibrate([500]);    
    } else {
      this.afAuth.auth.sendPasswordResetEmail(this.email).then(() => {
        this.erro = this.appService.language.m3;
      }).catch((err) => {
        this.erro = this.appService.language.e13;
      });
    }
  }

}
