import { Injectable, NgZone } from '@angular/core';
import { Observable, of, merge} from 'rxjs'
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { language_en, language_ptbr } from '../environments/language';
import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';

// The @Injectable() decorator tells TypeScript to emit metadata about the service. The metadata specifies that Angular may need to inject other dependencies into this service.
@Injectable() 
export class AppService {

    isConnected: Observable<boolean>;
    isSignin: Observable<boolean>;
    user: any;
    language: any;

    // list
    lists: any[] = ['list-detail','list-form','list-access','list-item'];
    bills: any[] = ['bill-detail','bill-form','bill-access','bill-item'];
    
    constructor(
        public afs: AngularFirestore,
        public afAuth: AngularFireAuth,        
        private router: Router,
        private ngZone: NgZone
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

        this.isConnected = merge(
            of(navigator.onLine),
            fromEvent(window, 'online').pipe(map(() => true)),
            fromEvent(window, 'offline').pipe(map(() => false))
        );

        this.afAuth.auth.onAuthStateChanged(user => {
            if (user) { 
                this.user = user;
                this.isSignin = of(true);  
                let lastroute = localStorage.getItem('lastroute');
                if (lastroute == "/login" || lastroute == undefined)                
                    lastroute = "/menu";
                this.ngZone.run(() => this.router.navigate([lastroute]));
            } else { 
                this.user = undefined;
                this.isSignin = of(false); 
                this.router.navigate(["/login"]);
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