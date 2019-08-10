import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AppService } from './app.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {  

  title = 'Firelist';
    
  isSignin: Observable<boolean>;
 
  constructor(
    public appService: AppService,
    public afAuth: AngularFireAuth,     
    public router: Router) { }  
  
  ngOnInit() { }

  logout() {
    this.afAuth.auth.signOut();   
  }

  menu() {
    this.router.navigate(['/menu']);
  }

}
