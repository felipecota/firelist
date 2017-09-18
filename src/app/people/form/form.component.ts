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
    tamanho: number; 

    form_submit(f: NgForm) { 
        this.angularFire.list("people")
            .map(list=>list.length)
            .subscribe(length=>this.tamanho = length);

        if (!navigator.onLine)
            this.erro = "App Offline";
        else if (f.controls.firstname.value == "" && f.controls.lastname.value == '') 
            this.erro = 'First and Last name are required';
        else if (this.tamanho >= 5)
            this.erro = "Max of 5 person";
        else {
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
        }   
    }

}
