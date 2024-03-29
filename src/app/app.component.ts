import { Component } from '@angular/core';
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
 
  constructor(
    public appService: AppService,
    public afAuth: AngularFireAuth,     
    public router: Router) { }  
  
  ngOnInit() { 
  }

  logout() {
    this.afAuth.auth.signOut();
    this.router.navigate(['/login']);
  }

  menu() {
    this.router.navigate(['/menu']);
  }

  swipe (type) {
    if ( type == 'swipeleft' )
    {
      if (this.router.url == "/list-detail")
        this.router.navigate(['/list-item']);
      else if (this.router.url == "/list-item")
        this.router.navigate(['/list-form']);        
      else if (this.router.url == "/list-form")
        this.router.navigate(['/list-access']);
      else if (this.router.url == "/bill-detail")
        this.router.navigate(['/bill-item']);
      else if (this.router.url == "/bill-item")
        this.router.navigate(['/bill-form']);        
      else if (this.router.url == "/bill-form")
        this.router.navigate(['/bill-access']);
      else
        this.router.navigate(['/menu']);
    }
    else
    {
      if (this.router.url == "/list-access")
        this.router.navigate(['/list-form']);
      else if (this.router.url == "/list-form")
        this.router.navigate(['/list-item']);        
      else if (this.router.url == "/list-item")
        this.router.navigate(['/list-detail']);
      else if (this.router.url == "/bill-access")
        this.router.navigate(['/bill-form']);
      else if (this.router.url == "/bill-form")
        this.router.navigate(['/bill-item']);        
      else if (this.router.url == "/bill-item")
        this.router.navigate(['/bill-detail']);
      else
        this.router.navigate(['/menu']);                            
    }
  }

}
