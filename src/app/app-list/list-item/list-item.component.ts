import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute }   from '@angular/router';
import { Observable, of } from 'rxjs'
import { map } from 'rxjs/operators';
import { ListService } from '../list.service';

import { AppService } from '../../app.service';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-list-item',
    templateUrl: './list-item.component.html',
    styleUrls: ['./list-item.component.css']
})

export class ListItemComponent implements OnInit {

    erro: string;   
    len: number = 0;
    lists: Observable<any[]>;
    items: any[];

    selected: boolean;
    listname: string;
    listkey: string;

    itemname: string;
    amount: string;

    title: string = this.appService.language["t5"];

    constructor(
        private appService: AppService, 
        private listService: ListService,
        private router: Router,
        private route: ActivatedRoute,
    ) { 
    }      

    ngOnInit() { 

        let data = this.route.snapshot.paramMap.get('data');
        if (data && data == "new" && this.listService.item != undefined) {           
            this.itemname = this.listService.item.description;
            this.amount = this.listService.item.amount;
            this.onSelect(this.listService.list);
        }        

        this.lists = this.appService.afs.collection('lists', ref => ref.where('access.'+this.appService.user.email.replace(/\./g,'´'),'==',true))
        .snapshotChanges()
        .pipe(
            map(lists => {

                this.len = lists.length;

                if (localStorage.getItem('lastList')) {
                    let result = lists.find(list => list.payload.doc.id == localStorage.getItem('lastList'));
                    if (result != undefined) {
                        const data = result.payload.doc.data();
                        const id = result.payload.doc.id;                
                        this.onSelect({ id, ...(data as {}) });
                    }
                }                

                return lists
                .sort(
                    (a,b) => a.payload.doc.data()["listname"].localeCompare(b.payload.doc.data()["listname"]))
                .map(list => {
                    const data = list.payload.doc.data();
                    const id = list.payload.doc.id;                
                    return { id, ...(data as {}) };                
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
        this.title = l.listname;
        localStorage.setItem('lastList', l.id);
    }    

    Include() { 

        let itemname = this.itemname;
        let amount = this.amount;

        if (this.items && this.items.length >= environment.limit_itens) {            

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
