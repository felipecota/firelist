import { Component, OnInit, NgZone } from '@angular/core';
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
    private appService: AppService,
    private ngZone: NgZone
  ) { }

  ngOnInit() {
  }

  toggleDisplay() {
    this.isLoggingIn = !this.isLoggingIn;
    this.erro = '';
  }

  loginWithFacebook() {
    this.loginSocial(new auth.OAuthProvider('facebook.com'));
  }

  loginWithGithub() {
    this.loginSocial(new auth.OAuthProvider('github.com'));
  }

  loginWithGoogle() {
    this.loginSocial(new auth.OAuthProvider('google.com'));
  }

  loginWithYahoo() {
    this.loginSocial(new auth.OAuthProvider('yahoo.com'));
  }

  loginWithMicrosoft() {
    this.loginSocial(new auth.OAuthProvider('microsoft.com'));
  }

  loginWithTwitter() {
    this.loginSocial(new auth.OAuthProvider('twitter.com'));
  }

  loginSocial(provider) {
    this.appService.afAuth.signInWithPopup(provider).then(result => {
      const user = result.user;

      if (user && this.pendingMail == user.email) {
        return user.linkWithCredential(this.pendingCred);
      }
    })
    .catch(error => {
      if (error.code === 'auth/account-exists-with-different-credential') {
        this.pendingCred = error.credential;
        this.pendingMail = error.email;

        // Get registered providers for this email.
        this.appService.afAuth.fetchSignInMethodsForEmail(this.pendingMail).then(providers => {
          if (providers[0] == "password" && providers.length == 1) {
            this.ngZone.run(() => {
              this.email = error.email;
              this.erro = this.appService.language.e16;
            });
          }
          else {
            this.ngZone.run(() => {
              this.erro = this.appService.language.e17.replace('$input$', providers[0].replace('.com', ''));
            });
          }
        });
      } else {
        this.erro = error.code;
      }
    });
  }

  login() {

    if (!this.email || !this.password) {
      this.erro = this.appService.language.e3;
      navigator.vibrate([500]);
    } else if (this.isLoggingIn) {
      this.appService.afAuth.signInWithEmailAndPassword(
        this.email.trim(), this.password)
        .then(result => {
          const user = result.user;

          if (user && this.pendingMail == this.email.trim()) {
            return user.linkWithCredential(this.pendingCred).then(() => user);
          }

          return user;
        })
        .then(user => {
          if (user && !this.appService.isEmailVerified && user.emailVerified) {
            this.appService.login(user);
          }
        })
        .catch(error => {
          if (error.code == "auth/user-not-found") {
            this.toggleDisplay();
            this.erro = this.appService.language.e21;
          }
          else if (error.code == "auth/wrong-password")
            this.erro = this.appService.language.e4;
          else {
            this.erro = error.code;
          }
        });
    } else {
      this.appService.afAuth.createUserWithEmailAndPassword(
        this.email.trim(), this.password)
        .then(ok => {
          this.toggleDisplay(); // Send verification e-mail and enable loggin
          this.erro = this.appService.language.e20;
        })
        .catch(error => {
          if (error.code === "auth/email-already-in-use") {
            this.appService.afAuth.fetchSignInMethodsForEmail(this.email).then(providers => {
              this.erro = this.appService.language.e17.replace('$input$', providers[0].replace('.com', ''));
              this.pendingCred = auth.EmailAuthProvider.credential(this.email, this.password);
              this.pendingMail = this.email;
            });
          }
          else
            this.erro = this.appService.language.e4;
        });
    }
  }

  forgot() {
    if (!this.email) {
      this.erro = this.appService.language.e3;
      navigator.vibrate([500]);
    } else {
      this.appService.afAuth.useDeviceLanguage();
      this.appService.afAuth.sendPasswordResetEmail(this.email).then(() => {
        this.erro = this.appService.language.m3;
      }).catch((err) => {
        this.erro = this.appService.language.e13;
      });
    }
  }

}