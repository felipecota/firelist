import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/Rx';
import { AfoListObservable, AngularFireOfflineDatabase } from 'angularfire2-offline/database';
import { AngularFireAuth } from 'angularfire2/auth';

// The @Injectable() decorator tells TypeScript to emit metadata about the service. The metadata specifies that Angular may need to inject other dependencies into this service.
@Injectable() 
export class AppService {

    isConnected: Observable<boolean>;
    items: AfoListObservable<any[]>;
    isSignin: Observable<boolean>;
    
    constructor(
        afoDatabase: AngularFireOfflineDatabase,
        private afAuth: AngularFireAuth
    ) {
        this.items = afoDatabase.list('item');       
        this.isConnected = Observable.merge(
            Observable.of(navigator.onLine),
            Observable.fromEvent(window, 'online').map(() => true),
            Observable.fromEvent(window, 'offline').map(() => false));            
        this.afAuth.auth.onAuthStateChanged(user => {user ? this.isSignin = Observable.of(true) : this.isSignin = Observable.of(false)});                    
    }       
}