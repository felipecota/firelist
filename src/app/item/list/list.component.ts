import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service'
import { FirebaseListObservable } from 'angularfire2/database';
import {
    AfoListObservable,
    AfoObjectObservable,
    AngularFireOfflineDatabase } from 'angularfire2-offline/database';
import { language } from '../../../environments/language';    

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})

export class ListComponent implements OnInit {

    items: AfoListObservable<any[]>;

    constructor(private appService: AppService) { 
        this.items = this.appService.items;
    }

    ngOnInit() { }

    onSelect(key): void {
        this.appService.items.remove(key).then(() => console.log('item removed: ' + key)),
          (e: any) => console.log(e.message);             
    }

}
