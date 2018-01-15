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
    this.afAuth.auth.signInWithRedirect(new firebase.auth.FacebookAuthProvider()).catch(function(error) {
      // An error happened.
      if (error.code === 'auth/account-exists-with-different-credential') {
        this.erro = this.appService.language.e16;
        navigator.vibrate([500]);
        /*
        // Step 2.
        // User's email already exists.
        // The pending Facebook credential.
        var pendingCred = error.credential;
        // The provider account's email address.
        var email = error.email;
        // Get registered providers for this email.
        this.afAuth.auth.fetchProvidersForEmail(email).then(function(providers) {
          // Step 3.
          // If the user has several providers,
          // the first provider in the list will be the "recommended" provider to use.
          if (providers[0] === 'password') {
            // Asks the user his password.
            // In real scenario, you should handle this asynchronously.
            var password = '';//promptUserForPassword(); // TODO: implement promptUserForPassword.
            this.afAuth.auth.signInWithEmailAndPassword(email, password).then(function(user) {
              // Step 4a.
              return user.link(pendingCred);
            }).then(function() {
              // Facebook account successfully linked to the existing Firebase user.
            });
            return;
          }
          // All the other cases are external providers.
          // Construct provider object for that provider.
          // TODO: implement getProviderForProviderId.
          var provider = this.afAuth.getProviderForProviderId(providers[0]);
          // At this point, you should let the user know that he already has an account
          // but with a different provider, and let him validate the fact he wants to
          // sign in with this provider.
          // Sign in to provider. Note: browsers usually block popup triggered asynchronously,
          // so in real scenario you should ask the user to click on a "continue" button
          // that will trigger the signInWithPopup.
          this.afAuth.auth.signInWithRedirect(provider).then(function(result) {
            // Remember that the user may have signed in with an account that has a different email
            // address than the first one. This can happen as Firebase doesn't control the provider's
            // sign in flow and the user is free to login using whichever account he owns.
            // Step 4b.
            // Link to Facebook credential.
            // As we have access to the pending credential, we can directly call the link method.
            result.user.link(pendingCred).then(function() {
              // Facebook account successfully linked to the existing Firebase user.
            });
          });
        });
        */
      }
    });
  }

  loginWithGoogle() {
    this.afAuth.auth.signInWithRedirect(new firebase.auth.GoogleAuthProvider()).catch(function(error) {
      if (error.code === 'auth/account-exists-with-different-credential') {
        this.erro = this.appService.language.e16;
        navigator.vibrate([500]);
      }
    });
  }  

  loginWithTwitter() {
      this.afAuth.auth.signInWithRedirect(new firebase.auth.TwitterAuthProvider());
  }    

  loginWithGithub() {
    this.afAuth.auth.signInWithRedirect(new firebase.auth.GithubAuthProvider()).catch(function(error) {
      console.log(error);
      if (error.code === 'auth/account-exists-with-different-credential') {
        this.erro = this.appService.language.e16;
        navigator.vibrate([500]);
      }
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
