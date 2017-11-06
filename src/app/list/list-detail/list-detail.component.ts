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
        this.appService.db.list('/access', {
              query: {
                  orderByChild: 'email',
                  equalTo: this.appService.user.email
              }
        }).subscribe(access => {
              this.access = access.sort((a,b) => a.listname.localeCompare(b.listname));
        });  

        this.appService.db.list('/items', {
            query: {
                orderByChild: 'email',
                equalTo: this.appService.user.email
            }
        }).subscribe(items => {
            this.items = items.sort((a,b) => a.itemname.localeCompare(b.itemname));
        });            
      }

      onSelect(itemkey): void {
        this.appService.db.list('/items', {
            query: {
                orderByChild: 'itemkey',
                equalTo: itemkey
            }
            }).take(1).forEach(e => {
                e.forEach(e => {
                    this.appService.db.list('/items').remove(e.$key);
                })
            });
      }

}
