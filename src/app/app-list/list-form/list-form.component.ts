import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators';

import { AppService } from '../../app.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-list-form',
  templateUrl: './list-form.component.html',
  styleUrls: ['./list-form.component.css']
})
export class ListFormComponent implements OnInit {

    erro: string;
    listname: string;
    lists: Observable<any[]>;
    length: any;
   
    constructor(
        private appService: AppService,
    ) { }

    ngOnInit() {

        this.lists = this.appService.afs.collection('lists', ref => ref.where('access.'+this.appService.user.email.replace('.','`'),'==',true))
        .snapshotChanges()
        .pipe(
            map(lists => {
                this.length = lists.length;
                return lists
                .sort(
                    (a,b) => a.payload.doc.data()["listname"].localeCompare(b.payload.doc.data()["listname"]))
                    .map(list => {
                        const data = list.payload.doc.data();
                        const id = list.payload.doc.id;                
                        return { id, ...data };                
                    })
                })
        ); 
        
    }

    Include() { 

        let d = new Date();
        let listkey = d.getFullYear()+''+d.getMonth()+''+d.getDay()+''+d.getHours()+''+d.getMinutes()+''+d.getSeconds()+''+(Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000);
        let listname = this.listname;
        this.listname = '';
        this.erro = '';

        if (this.length >= environment.limit) {

            this.erro = this.appService.language.e18;        
        
        } else if (!listname || listname == '')  {

            this.erro = this.appService.language.e6;
            navigator.vibrate([500]);

        } else {

            this.appService.afs.collection('lists').doc(listkey).set({
                listname: listname,
                access: {
                    [this.appService.user.email.replace('.','`')]: true
                }
            });
        }
    }  

    onSelect(id: string, items): void {

        if (!items || Object.keys(items).length == 0)
            this.appService.afs.collection('lists').doc(id).delete();
        else
            this.erro = this.appService.language.e7;

    }   

}
