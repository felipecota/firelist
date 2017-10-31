import { Component, OnInit } from '@angular/core';
import { AppService } from './app.service'
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { AfoListObservable } from 'angularfire2-offline/database';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {  

  title = 'realtimeapp';
  version = 'v3.4';
  isConnected: Observable<boolean>;
 
  constructor(
    public appService: AppService,
    private afAuth: AngularFireAuth,     
    private router: Router) { 
      this.isConnected = this.appService.isConnected;
  }    

  logout() {
    this.afAuth.auth.signOut();
    this.router.navigate(['/login']);    
  }

  language(i) {
    this.appService.language_set(i);
  }

}
