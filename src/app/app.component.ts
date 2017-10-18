import { Component, OnInit } from '@angular/core';
import { AppService } from './app.service'
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';

import { AfoListObservable } from 'angularfire2-offline/database';

import { language } from '../environments/language';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {  

  title = 'realtimeapp';
  version = 'v3.3';
  isConnected: Observable<boolean>;
  t5: string;
  t11: string;  
  t12: string;
  t13: string;
 
  constructor(
    public appService: AppService,
    private afAuth: AngularFireAuth,     
    private router: Router) { 
      this.isConnected = this.appService.isConnected;
      this.t5 = language.t5;
      this.t11 = language.t11;
      this.t12 = language.t12;       
      this.t13 = language.t13;       
  }    

  logout() {
    this.afAuth.auth.signOut();
    this.router.navigate(['/login']);    
  }

}
