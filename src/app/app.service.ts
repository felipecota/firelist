import { Injectable, NgZone } from '@angular/core';
import { Observable, of, merge} from 'rxjs'
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';

import { languages } from '../environments/language';

// The @Injectable() decorator tells TypeScript to emit metadata about the service. The metadata specifies that Angular may need to inject other dependencies into this service.
@Injectable() 
export class AppService {

    isConnected: Observable<boolean>;
    isSignin: boolean = false;
    isEmailVerified: boolean;
    user: any;
    language: any;
    erro: string;

    lists: any[] = ['list-detail','list-form','list-access','list-item'];
    bills: any[] = ['bill-detail','bill-form','bill-access','bill-item'];
    
    constructor(
        public afs: AngularFirestore,
        public afAuth: AngularFireAuth,
        private router: Router,
        private ngZone: NgZone
    ) {
        if (localStorage.getItem('lang'))
            this.language = languages.find(element => { return element.name == localStorage.getItem('lang')});
        else
        {
            if (navigator.language == "pt-BR")
                this.language = languages.find(element => { return element.name == 'ptbr'});
            else if (navigator.language == "fr")
                this.language = languages.find(element => { return element.name == 'fr'});
            else
                this.language = languages.find(element => { return element.name == 'en'});
        }  

        this.isConnected = merge(
            of(navigator.onLine),
            fromEvent(window, 'online').pipe(map(() => true)),
            fromEvent(window, 'offline').pipe(map(() => false))
        );

        this.afAuth.auth.onAuthStateChanged(user => {
            if (user) {               
                this.isEmailVerified = user.emailVerified;
                if (user.emailVerified || user.providerData[0].providerId != "password") {
                    this.login(user);
                } else {
                    this.afAuth.auth.useDeviceLanguage(); 
                    user.sendEmailVerification();
                }                
            } else {                 
                this.user = undefined;
                this.isSignin = false; 
                this.ngZone.run(() => this.router.navigate(["/login"]));
            } 
        });
            
    }

    login(user){
        this.user = user;
        this.isSignin = true;  
        let lastroute = localStorage.getItem('lastroute');
        if (lastroute == "/login" || lastroute == undefined)                
            lastroute = "/menu";
        this.ngZone.run(() => this.router.navigate([lastroute]))        
    }

    language_set(lang) {
        localStorage.setItem('lang', lang);        
        this.language = languages.find(element => { return element.name == lang});
    }
  
    display_error(msg) {
        this.erro = msg;
        navigator.vibrate([500]);
        setTimeout(() => {
            window.scrollTo(0, document.body.scrollHeight);                 
        }, 100);         
    }
}