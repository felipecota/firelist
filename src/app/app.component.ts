import { Component, OnInit } from '@angular/core';
import { AppService } from './app.service'
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';

import { language } from '../environments/language';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {  

  title = 'realtimeapp v2.0';
  isConnected: Observable<boolean>;
  t4: string;
  t5: string;  
  
  constructor(
    private appService: AppService,
    private afAuth: AngularFireAuth,     
    private router: Router) { 
      this.isConnected = this.appService.isConnected;
      this.t4 = language.t4;
      this.t5 = language.t5; 
  }    

  logout() {
    this.afAuth.auth.signOut();
  }

}
