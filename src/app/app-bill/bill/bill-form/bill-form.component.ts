import { Component, OnInit } from '@angular/core';
import { Router }   from '@angular/router';
import { Observable } from 'rxjs/Observable'

import { AppService } from '../../../app.service';
import { config } from '../../../../environments/language';

@Component({
  selector: 'app-bill-form',
  templateUrl: './bill-form.component.html',
  styleUrls: ['./bill-form.component.css']
})

export class BillFormComponent implements OnInit {

    erro: string;
    billname: string = "";
    bills: Observable<any[]>;
   
    constructor(
        private appService: AppService,
        private router: Router
    ) { }

    ngOnInit() {

        this.bills = this.appService.afs.collection('bills', ref => ref.where('access.'+this.appService.user.email.replace(/\./g,'´'),'==',true))
        .snapshotChanges()
        .map(bills => {
            return bills
            .sort(
                (a,b) => a.payload.doc.data().billname.localeCompare(b.payload.doc.data().billname))
            .map(bill => {
                const data = bill.payload.doc.data();
                const id = bill.payload.doc.id;                
                return { id, ...data };                
            })
        }); 

    }

    Include() { 

        let d = new Date();
        let billkey = d.getFullYear()+''+d.getMonth()+''+d.getDay()+''+d.getHours()+''+d.getMinutes()+''+d.getSeconds()+''+(Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000);
        let billname = this.billname;
        this.billname = '';        

        if (billname == '')  {
            this.erro = this.appService.language.e6;
            navigator.vibrate([500]);
        } else {
            this.erro = '';
            this.appService.afs.collection('bills').doc(billkey).set({
                billname: billname,
                access: {
                    [this.appService.user.email.replace(/\./g,'´')]: true
                }
            });
        }

    }  

    onSelect(id: string, access): void {

        if (Object.keys(access).length == 1) {
            this.erro = '';
            if (confirm(this.appService.language.m7))
                this.appService.afs.collection('bills').doc(id).delete();
        } else
            this.erro = this.appService.language.e15;

    }   

    fileChange(event) {
        if (this.billname == '') {
            this.erro = this.appService.language.e6;
            navigator.vibrate([500]);
        } else {        
            this.erro = '';
            let fileList: FileList = event.target.files;
            if(fileList.length > 0) {
                let reader = new FileReader();
                reader.onload = () => {
                    let items = JSON.parse(reader.result);

                    let d = new Date();
                    let billkey = d.getFullYear()+''+d.getMonth()+''+d.getDay()+''+d.getHours()+''+d.getMinutes()+''+d.getSeconds()+''+(Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000);
                    let billname = this.billname;

                    this.appService.afs.collection('bills').doc(billkey).set({
                        billname: billname,
                        access: {
                            [this.appService.user.email.replace(/\./g,'´')]: true
                        },
                        items: items
                    });                    
                }
                reader.readAsText(fileList[0]);      
            }

        }
    }

}
