import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable'
import * as fs from 'firebase';

import { AppService } from '../../../app.service';

@Component({
  selector: 'app-bill-detail',
  templateUrl: './bill-detail.component.html',
  styleUrls: ['./bill-detail.component.css']
})

export class BillDetailComponent implements OnInit {

    bills: Observable<any[]>; 
    items: any[];
    erro: string;
    billname: string;

    constructor(
        private appService: AppService
      ) { }
    
    ngOnInit() {

        this.bills = this.appService.afs.collection('bills', ref => ref.where('access.'+this.appService.user.email.replace('.','`'),'==',true))
        .snapshotChanges()
        .map(bills => {
            return bills
            .sort(
                (a,b) => a.payload.doc.data().listname.localeCompare(b.payload.doc.data().listname))
            .map(bill => {
                const data = bill.payload.doc.data();
                const id = bill.payload.doc.id;                
                return { id, ...data };                
            })
        }); 

    }

    onSelectBill(b): void {

        this.billname = b.billname;
        
        this.appService.afs.collection('bills').doc(b.id)
        .snapshotChanges()
        .forEach(list => {
            if (Object.keys(list.payload.data().items).length == 0)
                this.erro = this.appService.language.m5;
            else {
                let items = [];
                let data = list.payload.data();
                for (let key in data.items) {
                    items.push({
                        benefited: data.items[key].benefited,
                        date: new Date(data.items[key].date),
                        description: data.items[key].description,
                        value: data.items[key].value,
                        payer: data.items[key].payer,
                        itemkey: key
                    });
                }
                this.items = items;
            }
        }); 
    
    }    
}