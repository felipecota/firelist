import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router }   from '@angular/router';

import { AppService } from '../../app.service';
import { config } from '../../../environments/language';

@Component({
  selector: 'app-list-form',
  templateUrl: './list-form.component.html',
  styleUrls: ['./list-form.component.css']
})
export class ListFormComponent implements OnInit {

    erro: string;
    access: any[];
   
    constructor(
        private appService: AppService,
        private router: Router
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
    }

    form_submit(f: NgForm) { 

        let d = new Date();
        let listkey = d.getFullYear()+''+d.getMonth()+''+d.getDay()+''+d.getHours()+''+d.getMinutes()+''+d.getSeconds()+''+(Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000);

        if (f.controls.listname.value == '')  {
            this.erro = this.appService.language.e6;
            navigator.vibrate([500]);
        } else if (this.access.length >= config.max)
            this.erro = this.appService.language.e2;
        else {      
            let listname = f.controls.listname.value;     
            this.appService.db.list('/access').push(
                    {
                        listkey: listkey,
                        listname: listname,
                        email: this.appService.user.email
                    }
                ).then((t: any) => { 
                    console.log('list push ' + listname);
                }),
                (e: any) => console.log(e.message);

            f.controls.listname.setValue('');
            this.erro = '';
            this.router.navigate(['/item-form'])
        }        
    }  

    onSelect(lkey): void {
        this.appService.db.list('/items', {            
            query: {
                orderByChild: 'listkey',
                equalTo: lkey
            }
        }).take(1).forEach(data => {
            if (data.length > 0)
                this.erro = this.appService.language.e7;
            else {
                this.appService.db.list('/access', {
                    query: {
                        orderByChild: 'listkey',
                        equalTo: lkey
                    }
                }).take(1).forEach(access => {
                    access.forEach(e => {
                        this.appService.db.list('/access').remove(e.$key)
                        .then(() => console.log('access removed: ' + e.$key)),
                        (e: any) => console.log(e.message);
                    });
                } ); 
            }           
        });        
    }   

}
