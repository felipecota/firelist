import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router }   from '@angular/router';
import { AfoListObservable } from 'angularfire2-offline/database';

import { AppService } from '../../app.service';
import { config } from '../../../environments/language';

@Component({
    selector: 'app-form',
    templateUrl: './item-form.component.html',
    styleUrls: ['./item-form.component.css']
})

export class ItemFormComponent implements OnInit {

    erro: string;   
    length: number;
    t1: string;
    t2: string;
    t3: string;
    t5: string;
    access: any[];
    lists: any[];
    selected: boolean;
    listname: string;
    listkey: any;
    accesskey: any;

    constructor(
        private appService: AppService, 
        private router: Router
    ) { 
        this.t1 = this.appService.language.t1;
        this.t2 = this.appService.language.t2;
        this.t3 = this.appService.language.t3;
        this.t5 = this.appService.language.t5;
    }      

    ngOnInit() { 
        this.appService.db.list('/access', {
            query: {
                orderByChild: 'email',
                equalTo: this.appService.user.email
            }
        }).subscribe(access => {
            this.access = access.sort((a,b) => a.listname.localeCompare(b.listname));
        });
        this.erro = this.appService.language.m1;
    }

    onSelect(lkey, listname, akey): void {
        this.selected = true;
        this.erro = '';
        this.listname = listname;
        this.listkey = lkey;
        this.accesskey = akey;
        this.appService.db.list('/access', {
            query: {
                orderByChild: 'listkey',
                equalTo: lkey
            }
        }).subscribe(lists => this.lists = lists);        
    }    

    form_submit(f: NgForm) { 
        this.appService.db.list('/items', {            
            query: {
                orderByChild: 'email',
                equalTo: this.appService.user.email
            }
        }).subscribe(data => this.length = data.length);

        if (f.controls.itemname.value == '' || f.controls.amount.value == '')  {
            this.erro = this.appService.language.e1;
            navigator.vibrate([500]);
        } else if (this.length >= config.max)
            this.erro = this.appService.language.e2;
        else {      
            let d = new Date();
            let itemkey = d.getFullYear()+''+d.getMonth()+''+d.getDay()+''+d.getHours()+''+d.getMinutes()+''+d.getSeconds()+''+(Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000);
            this.lists.forEach(e => {
                this.appService.db.list('/items').push({
                    email: e.email,                    
                    itemkey: itemkey,
                    listkey: e.listkey,                    
                    itemname: f.controls.itemname.value,
                    amount: f.controls.amount.value
                }).then((t: any) => console.log('email ' + e.email + ' item push ' + t.key)),
                (e: any) => console.log(e.message);
            });

            f.controls.itemname.setValue('');
            f.controls.amount.setValue('');

            this.erro = '';

            this.router.navigate(['/list-detail'])
        }   
    }

}
