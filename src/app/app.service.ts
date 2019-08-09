import { Injectable, NgZone } from '@angular/core';
import { Observable, of, merge} from 'rxjs'
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { languages } from '../environments/language';
import { environment } from '../environments/environment';

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
        private ngZone: NgZone,
        private http: HttpClient
    ) {

        // Default language is english
        this.language = languages.find(element => { return element.name == 'en'});

        if (localStorage.getItem('lang') && localStorage.getItem('lang') == 'ptbr')
            this.language = languages.find(element => { return element.name == 'ptbr'});
        else
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(position => {
                  this.http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + position.coords.latitude + '%2C' + position.coords.longitude + '&language=en&key=' + environment.apiGeolocationKey)
                  .subscribe(data => {
                      data['results'].forEach(result => {
                          result['address_components'].forEach(component => {
                              component['types'].forEach(type => {
                                if (!localStorage.getItem('lang') && component['long_name'] == "Brazil")
                                {
                                    localStorage.setItem('lang', 'ptbr');        
                                    this.language = languages.find(element => { return element.name == 'ptbr'});
                                }
                              });
                          });
                      });
                  });
                });
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

    language_set(lang) {
        localStorage.setItem('lang', lang);        
        this.language = languages.find(element => { return element.name == lang});
    }
    
}