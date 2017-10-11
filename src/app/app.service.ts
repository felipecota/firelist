import { Injectable } from '@angular/core';
import { Observable, Subject} from 'rxjs/Rx';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/Rx';
import { AfoListObservable, AngularFireOfflineDatabase } from 'angularfire2-offline/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router, ActivatedRoute, Params } from '@angular/router';

// The @Injectable() decorator tells TypeScript to emit metadata about the service. The metadata specifies that Angular may need to inject other dependencies into this service.
@Injectable() 
export class AppService {

    isConnected: Observable<boolean>;
    isSignin: Observable<boolean>;
    user: any;
    returnUrl: string = '/';
    
    constructor(
        public afoDatabase: AngularFireOfflineDatabase,
        private router: Router,
        private route: ActivatedRoute,
        private afAuth: AngularFireAuth
    ) {

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
    
}