import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable'
import * as fs from 'firebase';
import { ActivatedRoute }   from '@angular/router';

import { AppService } from '../../../app.service';

@Component({
  selector: 'app-bill-detail',
  templateUrl: './bill-detail.component.html',
  styleUrls: ['./bill-detail.component.css']
})

export class BillDetailComponent implements OnInit {

    bills: Observable<any[]>; 
    items: Observable<any[]>;
    members: Observable<any[]>;
    erro: string;
    billname: string;
    billkey: string;

    constructor(
        private appService: AppService,
        private route: ActivatedRoute
      ) { }
    
    ngOnInit() {

        let b = {
            id: this.route.snapshot.paramMap.get('id1'),
            billname: this.route.snapshot.paramMap.get('id2')
        };
        if (b.id && b.billname)
            this.onSelectBill(b);

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
        this.billkey = b.id;
        
        this.appService.afs.collection('bills').doc(b.id)
        .snapshotChanges()
        .forEach(bill => {

            let items = [];
            let members = [];

            if (Object.keys(bill.payload.data().items).length == 0) {
                
                this.erro = this.appService.language.m5;
            
            } else {  

                for (let key in bill.payload.data().access) {
                    if (key.replace('`','.') != this.appService.user.email)
                        members.push({
                            email: key.replace('`','.'),
                            value: 0
                        });
                }  
                     
                let data = bill.payload.data();
                for (let key in data.items) {
                    
                    // Only show bills that's from my interest
                    let show = false;

                    data.items[key].benefited.forEach(b => {
                        let sn = data.items[key].payer == this.appService.user.email && b != this.appService.user.email;
                        let sp = data.items[key].payer != this.appService.user.email && b == this.appService.user.email;
                        if (sn || sp) {
                            show = true;
                            members.forEach(member => {
                                if (member.email == (sn?b:data.items[key].payer)){
                                    let valuepp = data.items[key].value/data.items[key].benefited.length;
                                    if (sn)
                                        member.value-=valuepp;
                                    else
                                        member.value+=valuepp;
                                };
                            });
                        };
                    });

                    if (show) 
                        items.push({
                            benefited: data.items[key].benefited,
                            date: new Date(data.items[key].date),
                            description: data.items[key].description,
                            value: data.items[key].value,
                            payer: data.items[key].payer,
                            itemkey: key
                        });
                };
            };
            
            this.members = Observable.of(members);
            
            this.items = Observable.of(items.sort((a,b) => { 
                if (a.date < b.date) {
                    return 1;
                } else if (a.date > b.date) {
                    return -1;
                } else {
                    return 0;
                }
            }));
        
        }); 
    
    }  
    
    onRemove(i): void {
        
        this.appService.afs.collection('bills').doc(this.billkey).update({
            ['items.'+i.itemkey]: fs.firestore.FieldValue.delete()
        })        
            
    }    
}