import { Injectable } from '@angular/core';
import { Observable, Subject} from 'rxjs/Rx';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/Rx';
import { AfoListObservable, AngularFireOfflineDatabase } from 'angularfire2-offline/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';

// The @Injectable() decorator tells TypeScript to emit metadata about the service. The metadata specifies that Angular may need to inject other dependencies into this service.
@Injectable() 
export class AppService {

    isConnected: Observable<boolean>;
    items: AfoListObservable<any[]>;
    lists: AfoListObservable<any[]>;    
    isSignin: Observable<boolean>;
    uidUser: string;
    
    constructor(
        private afoDatabase: AngularFireOfflineDatabase,
        private router: Router,
        private afAuth: AngularFireAuth
    ) {

        this.items = afoDatabase.list('item'); 
        this.lists = afoDatabase.list('lists'); 

        this.isConnected = Observable.merge(
            Observable.of(navigator.onLine),
            Observable.fromEvent(window, 'online').map(() => true),
            Observable.fromEvent(window, 'offline').map(() => false)); 

        this.afAuth.auth.onAuthStateChanged(user => {
            if (user) { 
                this.isSignin = Observable.of(true); 
            } else { 
                this.isSignin = Observable.of(false); 
                this.router.navigate(['/login'])} 
        });
            
    }
    
    isAuthenticated(): Observable<any> {
        const state = new Subject<any>();
  
        this.afAuth.authState.subscribe( (user) => {
          if (user) {
            this.uidUser = user.uid;
            console.log('the user id:' + this.uidUser);
            state.next(true);
          } else {
            console.log("no user");
            state.next(false);
          }
        })
  
        return state.asObservable();
    }     
}