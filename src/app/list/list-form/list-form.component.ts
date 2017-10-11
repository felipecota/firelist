import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router }   from '@angular/router';

import { AppService } from '../../app.service';
import { language, config } from '../../../environments/language';

@Component({
  selector: 'app-list-form',
  templateUrl: './list-form.component.html',
  styleUrls: ['./list-form.component.css']
})
export class ListFormComponent implements OnInit {

    erro: string;
    t3: string;
    t5: string; 
    access: any[];
   
    constructor(
        private appService: AppService,
        private router: Router
    ) { 
        this.t3 = language.t3;
        this.t5 = language.t5;
    }

    ngOnInit() {
        this.appService.afoDatabase.list('/access', {
            query: {
                orderByChild: 'email',
                equalTo: this.appService.user.email
            }
        }).subscribe(lists => this.access = lists);
    }

    form_submit(f: NgForm) { 
        if (f.controls.listname.value == '')  {
            this.erro = language.e6;
            navigator.vibrate([500]);
        } else if (this.access.length >= config.max)
            this.erro = language.e2;
        else {      
            let listname = f.controls.listname.value;     
            this.appService.afoDatabase.list('/lists').push(
                    {
                        listname: listname
                    }
                ).then((t: any) => { 
                    this.appService.afoDatabase.list('/access').push(
                        {
                            listname: listname,
                            listkey: t.key,
                            email: this.appService.user.email
                        });                 
                    console.log('list push ' + t.key) 
                }),
                (e: any) => console.log(e.message);

            f.controls.listname.setValue('');
            this.erro = '';
            this.router.navigate(['/item-form'])
        }        
    }  

    onSelect(lkey): void {
        let sub = this.appService.afoDatabase.list('/access', {
            query: {
                orderByChild: 'listkey',
                equalTo: lkey
            }
        })
        .subscribe(access => {
            access.forEach(e => {
                if (!e.items) {
                    this.appService.afoDatabase.list('/lists').remove(lkey)
                    .then(() => console.log('list removed: ' + lkey)),
                    (e: any) => console.log(e.message);
                    this.appService.afoDatabase.list('/access').remove(e.$key)
                    .then(() => console.log('access removed: ' + e.$key)),
                    (e: any) => console.log(e.message);
                } else
                    this.erro = language.e7;
            });
            sub.unsubscribe();
        } );        
    }   

}
