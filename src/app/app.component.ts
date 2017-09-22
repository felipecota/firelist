import { Component, OnInit } from '@angular/core';
import { AppService } from './app.service'
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {  

  title = 'realtimeapp v1.8';
  isConnected: Observable<boolean>;
  
  constructor(private appService: AppService) { 
      this.isConnected = this.appService.isConnected;
  }  

}
