import { Component, OnInit } from '@angular/core';
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
  pendingCred: any;
  pendingMail: string;

  constructor(
    private appService: AppService,
    private router: Router
  ) { }

  ngOnInit() {
/*
    firebase.auth().getRedirectResult().catch(error => {
      // An error happened.
      if (error.code === 'auth/account-exists-with-different-credential') {
        // Step 2.
        // User's email already exists.
        // The pending Facebook credential.
        this.pendingCred = error.credential;
        // The provider account's email address.
        this.pendingMail = error.email;
        //this.email = error.email;
        //this.erro = this.appService.language.e16;

        // Get registered providers for this email.
        this.appService.afAuth.auth.fetchProvidersForEmail(this.pendingMail).then(providers => {
          console.log(providers);
          // Step 3.
          // If the user has several providers,
          // the first provider in the list will be the "recommended" provider to use.
          if (providers[0] === 'password') {
            // Asks the user his password.
            // In real scenario, you should handle this asynchronously.
            if (!this.password) {
              
            } else {
              this.appService.afAuth.auth.signInWithEmailAndPassword(this.pendingMail, this.password).then(user => {
                // Step 4a.
                return user.link(this.pendingCred);
              }).then(function() {
                // Facebook account successfully linked to the existing Firebase user.
              });
              return;
            }
          } else
            this.erro = this.appService.language.e17;                  
          // All the other cases are external providers.
          // Construct provider object for that provider.
          // TODO: implement getProviderForProviderId.
          //var provider = this.appService.afAuth.auth.getProviderForProviderId(providers[0]);
          // At this point, you should let the user know that he already has an account
          // but with a different provider, and let him validate the fact he wants to
          // sign in with this provider.
          // Sign in to provider. Note: browsers usually block popup triggered asynchronously,
          // so in real scenario you should ask the user to click on a "continue" button
          // that will trigger the signInWithPopup.
          //this.appService.afAuth.auth.signInWithRedirect(provider).then(function(result) {
            // Remember that the user may have signed in with an account that has a different email
            // address than the first one. This can happen as Firebase doesn't control the provider's
            // sign in flow and the user is free to login using whichever account he owns.
            // Step 4b.
            // Link to Facebook credential.
            // As we have access to the pending credential, we can directly call the link method.
            //result.user.link(pendingCred).then(function() {
              // Facebook account successfully linked to the existing Firebase user.
            //});
          //});
        });
      }
     });  */   
  }

  toggleDisplay() {
    this.isLoggingIn = !this.isLoggingIn;
    this.erro = '';
  }  

  loginWithFacebook() {
    this.loginSocial(new firebase.auth.FacebookAuthProvider());
  }

  loginWithGoogle() {
    this.loginSocial(new firebase.auth.GoogleAuthProvider());
  }  

  loginWithGithub() {
    this.loginSocial(new firebase.auth.GithubAuthProvider());
  }     

  loginSocial(provider) {
    this.appService.afAuth.auth.signInWithPopup(provider)
    .then(result => {
      if (this.pendingMail == this.appService.afAuth.auth.currentUser.email)
        this.appService.afAuth.auth.currentUser.linkWithCredential(this.pendingCred);
    })
    .catch(error => {
      if (error.code === 'auth/account-exists-with-different-credential') {
        this.pendingCred = error.credential;
        this.pendingMail = error.email;
        // Get registered providers for this email.
        this.appService.afAuth.auth.fetchProvidersForEmail(this.pendingMail).then(providers => {
          if (providers[0] == "password") {
            this.email = error.email;
            this.erro = this.appService.language.e16;            
          } else
          {        
            this.erro = this.appService.language.e17.replace('$input$',providers[0].replace('.com',''));
          }
        });
      }
    });
  }

  login() {
    if (!this.email || !this.password)  {
      this.erro = this.appService.language.e3;
      navigator.vibrate([500]);    
    } else if (this.isLoggingIn)
      this.appService.afAuth.auth.signInWithEmailAndPassword(
        this.email, this.password)
        .then(user => { 
          if (this.pendingMail == this.email) {
            this.appService.afAuth.auth.currentUser.linkWithCredential(this.pendingCred);
          }
        })
        .catch(error => {
          this.erro = this.appService.language.e4
        });    
    else
      this.appService.afAuth.auth.createUserWithEmailAndPassword(
        this.email, this.password)
        .then(ok => {})
        .catch(error => {
          if (error.code === "auth/email-already-in-use") {
            this.appService.afAuth.auth.fetchProvidersForEmail(this.email).then(providers => {
              this.erro = this.appService.language.e17.replace('$input$',providers[0].replace('.com',''));       
              this.pendingCred = firebase.auth.EmailAuthProvider.credential(this.email, this.password);
              this.pendingMail = this.email;
            });
          }    
          else
            this.erro = this.appService.language.e4; 
        });
  } 

  forgot() {
    if (!this.email)  {
      this.erro = this.appService.language.e3;
      navigator.vibrate([500]);
    } else {
      this.appService.afAuth.auth.sendPasswordResetEmail(this.email).then(() => {
        this.erro = this.appService.language.m3;
      }).catch((err) => {
        this.erro = this.appService.language.e13;
      });
    }
  }

}
