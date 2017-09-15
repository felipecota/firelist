import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/Rx';

// The @Injectable() decorator tells TypeScript to emit metadata about the service. The metadata specifies that Angular may need to inject other dependencies into this service.
@Injectable() 
export class AppService {

    isConnected: Observable<boolean>;
    
    constructor() {
    this.isConnected = Observable.merge(
        Observable.of(navigator.onLine),
        Observable.fromEvent(window, 'online').map(() => true),
        Observable.fromEvent(window, 'offline').map(() => false));
    }  

}