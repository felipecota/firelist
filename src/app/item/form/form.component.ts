import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { language, config } from '../../../environments/language';
import { Router }   from '@angular/router';

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.css']
})

export class FormComponent implements OnInit {

    erro: string;   
    length: number;
    t1: string;
    t2: string;
    t3: string;

    constructor(private appService: AppService, private router: Router) { 
        this.t1 = language.t1;
        this.t2 = language.t2;
        this.t3 = language.t3;
    }      

    ngOnInit() { }

    form_submit(f: NgForm) { 
        this.appService.items.subscribe(data => this.length = data.length);

        if (f.controls.itemname.value == "" && f.controls.amount.value == '')  {
            this.erro = language.e1;
            navigator.vibrate([500]);
        } else if (this.length >= config.max)
            this.erro = language.e2;
        else {            
            this.appService.items.push(
                    {
                        itemname: f.controls.itemname.value,
                        amount: f.controls.amount.value
                    }
                ).then((t: any) => console.log(t.key)),
                (e: any) => console.log(e.message);

            f.controls.itemname.setValue('');
            f.controls.amount.setValue('');

            this.erro = '';

            this.router.navigate(['/list'])
        }   
    }

}
