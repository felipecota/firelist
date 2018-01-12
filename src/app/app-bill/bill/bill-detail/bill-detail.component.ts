import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable'
import * as fs from 'firebase';
import { ActivatedRoute, Router }   from '@angular/router';
import 'rxjs/add/operator/take';

import { AppService } from '../../../app.service';
import { BillService } from '../bill.service';

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
    billselected: boolean = false;

    constructor(
        private appService: AppService,
        private billService: BillService,
        private route: ActivatedRoute,
        private router: Router
      ) { }
    
    ngOnInit() {

        let b = {
            id: this.route.snapshot.paramMap.get('id1'),
            billname: this.route.snapshot.paramMap.get('id2')
        };
        if (b.id && b.billname)
            this.onSelectBill(b);

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

    onSelectBill(b): void {

        this.billname = b.billname;
        this.billkey = b.id;
        this.billselected = true;
        
        this.appService.afs.collection('bills').doc(b.id)
        .snapshotChanges()
        .forEach(bill => {

            let items = [];
            let members = [];

            if (!bill.payload.exists || !bill.payload.data().items || Object.keys(bill.payload.data().items).length == 0) {                
                this.erro = this.appService.language.m5;            
            } else {  

                for (let key in bill.payload.data().access) {
                    if (key.replace(/´/g,'.') != this.appService.user.email) {
                        let format = key.replace(/´/g,'.').split("@");
                        if (format[0].length > 20)
                            format[0] = format[0].substr(0,7)+"..."+format[0].substr(format[0].length-7,7);
                        members.push({
                            email: key.replace(/´/g,'.'),
                            emailf: format[0]+"@"+format[1],
                            value: 0
                        });
                    }
                }  
                     
                let data = bill.payload.data();
                for (let key in data.items) {                  
                    
                    // Only show bills that's from my interest
                    let show = false;

                    data.items[key].benefited.forEach(b => {
                        let sn = data.items[key].payer == this.appService.user.email && b != this.appService.user.email;
                        let sp = data.items[key].payer != this.appService.user.email && b == this.appService.user.email;
                        let ow = data.items[key].owner == this.appService.user.email;
                        let my = data.items[key].payer == this.appService.user.email && b == this.appService.user.email;
                        if (sn || sp || ow || my) {
                            show = true;
                            if (sn || sp) {
                                members.forEach(member => {
                                    if (member.email == (sn?b:data.items[key].payer)){
                                        let valuepp = (data.items[key].value*(data.items[key].multiplier != undefined?data.items[key].multiplier:1))/data.items[key].benefited.length;
                                        if (sn)
                                            member.value+=valuepp;
                                        else
                                            member.value-=valuepp;
                                    };
                                });
                            }
                        };
                    });

                    if (show) 
                        items.push({
                            benefited: data.items[key].benefited,
                            date: new Date(data.items[key].date),
                            description: data.items[key].description,
                            value: data.items[key].value,
                            multiplier: (data.items[key].multiplier != undefined?data.items[key].multiplier:1),
                            calculated: data.items[key].value*(data.items[key].multiplier != undefined?data.items[key].multiplier:1),
                            payer: data.items[key].payer,
                            place: data.items[key].place,
                            type: (
                                this.appService.language.name == "en_us" ? 
                                data.items[key].type
                                .replace('Diversos','Others')
                                .replace('Transporte','Transportation')
                                .replace('Hospedagem','Hosting')
                                .replace('Passeios','Recreation')
                                .replace('Taxas','Taxes')
                                .replace('Alimentação','Food') : 
                                data.items[key].type
                                .replace('Others','Diversos')
                                .replace('Transportation','Transporte')
                                .replace('Hosting','Hospedagem')
                                .replace('Recreation','Passeios')
                                .replace('Taxes','Taxas')
                                .replace('Food','Alimentação') ),
                            owner: data.items[key].owner,
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
        if (i.owner != this.appService.user.email)        
            alert(this.appService.language.m8);
        else if (confirm(this.appService.language.m7))
            this.appService.afs.collection('bills').doc(this.billkey).update({
                ['items.'+i.itemkey]: fs.firestore.FieldValue.delete()
            })        
    }   

    onEdit(i): void {
        if (i.owner != this.appService.user.email)        
            alert(this.appService.language.m9);
        else {
            this.billService.item = {
                billkey: this.billkey,
                billname: this.billname,
                itemkey: i.itemkey,
                payer: i.payer,
                date: i.date,
                place: i.place,
                description: i.description,
                type: i.type,
                value: i.value,
                multiplier: i.multiplier,
                calculated: i.calculated,
                benefited: i.benefited
            }
            this.router.navigate(['/bill-item/edit']);        
        }
    }
    
    backup() {

        this.appService.afs.collection('bills').doc(this.billkey)
        .snapshotChanges()
        .take(1)
        .forEach(bill => {
            let payload = bill.payload.data();
            let now = new Date();
            let data = new Blob([JSON.stringify(payload.items)], {type: 'text/plain'});  
            let link = document.createElement('a');
            link.href = window.URL.createObjectURL(data);
            link.setAttribute('download', 'backup_realtimeapp_'+now.getFullYear()+now.getMonth()+now.getDate()+'.txt');
            document.body.appendChild(link);    
            link.click();
            document.body.removeChild(link);                          
        });

    }
}