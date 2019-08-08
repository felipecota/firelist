import { Component, OnInit } from '@angular/core';
import { Router }   from '@angular/router';
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators';

import { AppService } from '../../../app.service';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-list-item',
    templateUrl: './list-item.component.html',
    styleUrls: ['./list-item.component.css']
})

export class ListItemComponent implements OnInit {

    erro: string;   
    length: number;
    lists: Observable<any[]>;
    items: any[];

    selected: boolean;
    listname: string;
    listkey: string;

    itemname: string;
    amount: string;

    constructor(
        private appService: AppService, 
        private router: Router
    ) { 
    }      

    ngOnInit() { 
        this.lists = this.appService.afs.collection('lists', ref => ref.where('access.'+this.appService.user.email.replace('.','`'),'==',true))
        .snapshotChanges()
        .pipe(
            map(lists => {
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

        this.erro = this.appService.language.m1;
    }

    onSelect(l): void {
        this.selected = true;
        this.erro = '';
        this.listname = l.listname;
        this.listkey = l.id;
    }    

    Include() { 

        let itemname = this.itemname;
        let amount = this.amount;

        if (this.items.length >= environment.limit) {            

            this.erro = this.appService.language.e18;        
            
        } else if (!itemname || itemname.trim() == '' || !amount || amount.trim() == '')  {
            
            this.erro = this.appService.language.e1;
            navigator.vibrate([500]);

        } else {  
            
            this.itemname = '';
            this.amount = '';            

            let d = new Date();
            let itemkey = d.getFullYear()+''+d.getMonth()+''+d.getDay()+''+d.getHours()+''+d.getMinutes()+''+d.getSeconds()+''+(Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000);                        
           
            this.appService.afs.collection('lists').doc(this.listkey).update({
                ['items.'+itemkey]: {
                    itemname: itemname,
                    amount: amount
                }
            })

            this.erro = '';
            this.router.navigate(['/list-detail']);                            

        }   
    }

}
