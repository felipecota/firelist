import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { auth } from 'firebase/app';

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
    private appService: AppService
  ) { }

  ngOnInit() { }

  toggleDisplay() {
    this.isLoggingIn = !this.isLoggingIn;
    this.erro = '';
  }  

  loginWithFacebook() {
    this.loginSocial(new auth.FacebookAuthProvider());
  }

  loginWithGoogle() {
    this.loginSocial(new auth.GoogleAuthProvider());
  }  

  loginWithYahoo() {
    this.loginSocial(new auth.OAuthProvider('yahoo.com'));
  }     

  loginWithMicrosoft() {
    this.loginSocial(new auth.OAuthProvider('microsoft.com'));
  }   

  loginWithTwitter() {
    this.loginSocial(new auth.TwitterAuthProvider());
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
        this.appService.afAuth.auth.fetchSignInMethodsForEmail(this.pendingMail).then(providers => {
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
            this.appService.afAuth.auth.fetchSignInMethodsForEmail(this.email).then(providers => {
              this.erro = this.appService.language.e17.replace('$input$',providers[0].replace('.com',''));       
              this.pendingCred = auth.EmailAuthProvider.credential(this.email, this.password);
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
      auth().useDeviceLanguage(); 
      this.appService.afAuth.auth.sendPasswordResetEmail(this.email).then(() => {
        this.erro = this.appService.language.m3;
      }).catch((err) => {
        this.erro = this.appService.language.e13;
      });
    }
  }

}
