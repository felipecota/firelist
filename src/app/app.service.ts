import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable'
import { Subscription } from 'rxjs/Subscription';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { language_en, language_ptbr } from '../environments/language';
import 'rxjs/add/observable/fromEvent';

// The @Injectable() decorator tells TypeScript to emit metadata about the service. The metadata specifies that Angular may need to inject other dependencies into this service.
@Injectable() 
export class AppService {

    isConnected: Observable<boolean>;
    isSignin: Observable<boolean>;
    user: any;
    returnUrl: string = '/menu';
    language: any;

    // list
    lists: any[] = ['list-detail','list-form','list-access','list-item'];
    bills: any[] = ['bill-detail','bill-form','bill-access','bill-item'];
    
    constructor(
        public afs: AngularFirestore,
        private router: Router,
        private route: ActivatedRoute,
        private afAuth: AngularFireAuth,
    ) {

        if (localStorage.getItem('lang')) {
            if (localStorage.getItem('lang') == 'ptbr')
                this.language = language_ptbr;
            else
                this.language = language_en;
        } else {
            localStorage.setItem('lang', 'ptbr');        
            this.language = language_ptbr;
        }

        this.isConnected = Observable.merge(
            Observable.of(navigator.onLine),
            Observable.fromEvent(window, 'online').map(() => true),
            Observable.fromEvent(window, 'offline').map(() => false)); 

        this.afAuth.auth.onAuthStateChanged(user => {
            if (user) { 
                this.user = user;
                this.isSignin = Observable.of(true);  
                this.router.navigate([this.returnUrl]);
            } else { 
                this.user = undefined;
                this.isSignin = Observable.of(false); 
            } 
        });
            
    }

    language_set(i) {
        if (i==1) {
            localStorage.setItem('lang', 'ptbr');        
            this.language = language_ptbr;
        } else {
            localStorage.setItem('lang', 'en');        
            this.language = language_en;
        }
    }
    
}