import { FormsModule, NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service'
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css'],
  providers: [AppService]
})

export class PeopleComponent implements OnInit {

  isConnected: Observable<boolean>;

  constructor(private appService: AppService) { }

  ngOnInit() { 
      this.isConnected = this.appService.isConnected;
  }
}
