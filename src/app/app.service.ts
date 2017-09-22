import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/Rx';
import { AfoListObservable, AngularFireOfflineDatabase } from 'angularfire2-offline/database';

// The @Injectable() decorator tells TypeScript to emit metadata about the service. The metadata specifies that Angular may need to inject other dependencies into this service.
@Injectable() 
export class AppService {

    isConnected: Observable<boolean>;
    items: AfoListObservable<any[]>;
    
    constructor(afoDatabase: AngularFireOfflineDatabase) {
        this.items = afoDatabase.list('item');       
        this.isConnected = Observable.merge(
            Observable.of(navigator.onLine),
            Observable.fromEvent(window, 'online').map(() => true),
            Observable.fromEvent(window, 'offline').map(() => false));        
    }       

}