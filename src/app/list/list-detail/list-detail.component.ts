import { Component, OnInit } from '@angular/core';

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
              let items = [];
              access.forEach(e => {
                if (e.items) {
                    Object.keys(e.items).map(function (key) { 
                        items.push({
                            listkey: e.listkey,
                            itemkey: key,
                            itemname: e.items[key].itemname,
                            amount: e.items[key].amount
                        });                     
                    });
                };
              });
              this.items = items;
          });  
      }

      onSelect(lkey, iName, iAmount): void {
        let sub = this.appService.afoDatabase.list('/access', {
            query: {
                orderByChild: 'listkey',
                equalTo: lkey
            }
            }).subscribe(access => {
                let items = [];
                access.forEach(e => {
                    if (e.items) {
                        Object.keys(e.items).map(function (key) {
                            if (e.items[key].itemname == iName && e.items[key].amount == iAmount)
                                items.push({
                                    accesskey: e.$key,
                                    itemkey: key
                                });                                                      
                        });
                    };                                                         
                });        
                items.map(e => {
                    this.appService.afoDatabase.list('/access/'+e.accesskey+'/items')
                        .remove(e.itemkey)
                        .then(() => console.log('access ' + e.accesskey + ' item removed: ' + e.itemkey)),
                        (e: any) => console.log(e.message);
                });
                // First time subscribe returns only the first one
                setTimeout(() => {sub.unsubscribe();},1000);
            });                     
      }

}
