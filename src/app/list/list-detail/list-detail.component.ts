import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { AppService } from '../../app.service'

@Component({
  selector: 'app-list-detail',
  templateUrl: './list-detail.component.html',
  styleUrls: ['./list-detail.component.css']
})

export class ListDetailComponent implements OnInit {

      access: any[];
      items: any[];

      constructor(
          private appService: AppService
      ) { }
  
      ngOnInit() { 
        this.appService.afoDatabase.list('/access', {
              query: {
                  orderByChild: 'email',
                  equalTo: this.appService.user.email
              }
        }).subscribe(access => {
              this.access = access;
        });  

        this.appService.afoDatabase.list('/items', {
            query: {
                orderByChild: 'email',
                equalTo: this.appService.user.email
            }
        }).subscribe(items => {
            this.items = items;
        });            
      }

      onSelect(itemkey): void {
        this.appService.afoDatabase.list('/items', {
            query: {
                orderByChild: 'itemkey',
                equalTo: itemkey
            }
            }).take(1).forEach(e => {
                e.forEach(e => {
                    this.appService.afoDatabase.list('/items').remove(e.$key);
                })
            });
      }

}
