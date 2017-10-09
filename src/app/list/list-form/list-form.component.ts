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
    length: number;  
    lists: any[];
    items: any[];
    
    constructor(
        private appService: AppService,
        private router: Router
    ) { 
        this.t3 = language.t3;
        this.t5 = language.t5;
    }

    ngOnInit() {
        this.appService.lists.subscribe(lists => this.lists = lists);
    }

    form_submit(f: NgForm) { 
        this.appService.lists.subscribe(data => this.length = data.length);

        if (f.controls.listname.value == '')  {
            this.erro = language.e6;
            navigator.vibrate([500]);
        } else if (this.length >= config.max)
            this.erro = language.e2;
        else {           
            this.appService.lists.push(
                    {
                        listname: f.controls.listname.value
                    }
                ).then((t: any) => console.log(t.key)),
                (e: any) => console.log(e.message);

            f.controls.listname.setValue('');

            this.erro = '';

            this.router.navigate(['/item-form'])
        }        
    }  

    onSelect(key): void {
        this.appService.items.subscribe(items => this.items = items);
        if (this.items.filter(items => items.list === key).length == 0) {
            this.appService.lists.remove(key).then(() => console.log('list removed: ' + key)),
                (e: any) => console.log(e.message);
            this.erro = '';
        } else
            this.erro = language.e7;
    }   

}
