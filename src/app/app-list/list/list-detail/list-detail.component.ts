import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs'
import * as fs from 'firebase';
import { map } from 'rxjs/operators';

import { AppService } from '../../../app.service'

@Component({
  selector: 'app-list-detail',
  templateUrl: './list-detail.component.html',
  styleUrls: ['./list-detail.component.css']
})

export class ListDetailComponent implements OnInit {

      lists: Observable<any[]>;
      items: any[];
      len: number;

      constructor(
          private appService: AppService
      ) { }
  
      ngOnInit() { 

        this.lists = this.appService.afs.collection('lists', ref => ref.where('access.'+this.appService.user.email.replace('.','`'),'==',true))
        .snapshotChanges()
        .pipe(map(lists => {
            this.len = lists.length;
            return lists
            .sort(
                (a,b) => a.payload.doc.data().listname.localeCompare(b.payload.doc.data().listname))
            .map(list => {                
                let temp = [];
                const data = list.payload.doc.data();                
                for (let key in data.items) {
                    temp.push({
                        itemkey: key,
                        itemname: data.items[key].itemname,
                        amount: data.items[key].amount
                    });
                }
                data.items = temp.sort((a,b) => a.itemname.localeCompare(b.itemname));
                const id = list.payload.doc.id;                
                return { id, ...data };                
            })
        }));    
             
      }

      onSelect(list, itemkey): void {

        this.appService.afs.collection('lists').doc(list.id).update({
            ['items.'+itemkey]: fs.firestore.FieldValue.delete()
        })        
          
    }

}
