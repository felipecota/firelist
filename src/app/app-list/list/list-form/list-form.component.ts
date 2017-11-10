import { Component, OnInit } from '@angular/core';
import { Router }   from '@angular/router';
import { Observable } from 'rxjs/Observable'

import { AppService } from '../../../app.service';
import { config } from '../../../../environments/language';

@Component({
  selector: 'app-list-form',
  templateUrl: './list-form.component.html',
  styleUrls: ['./list-form.component.css']
})
export class ListFormComponent implements OnInit {

    erro: string;
    listname: string;
    lists: Observable<any[]>;
   
    constructor(
        private appService: AppService,
        private router: Router
    ) { }

    ngOnInit() {

        this.lists = this.appService.afs.collection('lists', ref => ref.where('access.'+this.appService.user.email.replace('.','`'),'==',true))
        .snapshotChanges()
        .map(lists => {
            return lists
            .sort(
                (a,b) => a.payload.doc.data().listname.localeCompare(b.payload.doc.data().listname))
            .map(list => {
                const data = list.payload.doc.data();
                const id = list.payload.doc.id;                
                return { id, ...data };                
            })
        }); 

    }

    Include() { 

        let d = new Date();
        let listkey = d.getFullYear()+''+d.getMonth()+''+d.getDay()+''+d.getHours()+''+d.getMinutes()+''+d.getSeconds()+''+(Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000);
        let listname = this.listname;
        this.listname = '';
        this.erro = '';

        if (listname == '')  {
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
