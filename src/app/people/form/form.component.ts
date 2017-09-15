import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.css']
})

export class FormComponent implements OnInit {

    constructor(private angularFire: AngularFireDatabase) { }      

    ngOnInit() { }

    erro: string;

    form_submit(f: NgForm) { 
        if (!navigator.onLine)
            this.erro = "App Offline";
        else if (f.controls.firstname.value != "" && f.controls.lastname.value != '') {
            this.angularFire.list("people").push(
            {
                firstname: f.controls.firstname.value,
                lastname: f.controls.lastname.value
            }
            ).then((t: any) => console.log('person inserted: ' + t.key)),
            (e: any) => console.log(e.message);
            f.controls.firstname.setValue('');
            f.controls.lastname.setValue('');
            this.erro = '';
        } else
            this.erro = 'First and Last name are required';
    }

}
