import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router }   from '@angular/router';
import { AfoListObservable } from 'angularfire2-offline/database';

import { AppService } from '../../app.service';
import { language, config } from '../../../environments/language';

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
    lists: AfoListObservable<any[]>;
    selected: boolean;
    listname: string;
    listkey: any;

    constructor(
        private appService: AppService, 
        private router: Router
    ) { 
        this.t1 = language.t1;
        this.t2 = language.t2;
        this.t3 = language.t3;
        this.t5 = language.t5;
    }      

    ngOnInit() { 
        this.lists = this.appService.lists;
        this.erro = language.m1;
    }

    onSelect(key, listname): void {
        this.selected = true;
        this.erro = '';
        this.listname = listname;
        this.listkey = key;
    }    

    form_submit(f: NgForm) { 
        this.appService.items.subscribe(data => this.length = data.length);

        if (f.controls.itemname.value == '' || f.controls.amount.value == '')  {
            this.erro = language.e1;
            navigator.vibrate([500]);
        } else if (this.length >= config.max)
            this.erro = language.e2;
        else {            
            this.appService.items.push(
                    {
                        itemname: f.controls.itemname.value,
                        amount: f.controls.amount.value,
                        list: this.listkey
                    }
                ).then((t: any) => console.log(t.key)),
                (e: any) => console.log(e.message);

            f.controls.itemname.setValue('');
            f.controls.amount.setValue('');

            this.erro = '';

            this.router.navigate(['/list-detail'])
        }   
    }

}
