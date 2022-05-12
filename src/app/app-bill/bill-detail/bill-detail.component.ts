import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ActivatedRoute, Router }   from '@angular/router';
import { map } from 'rxjs/operators';
import { firestore } from 'firebase/app';
import * as CryptoJS from 'crypto-js'; 

import { AppService } from '../../app.service';
import { BillService } from '../bill.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-bill-detail',
  templateUrl: './bill-detail.component.html',
  styleUrls: ['./bill-detail.component.css']
})

export class BillDetailComponent implements OnInit, OnDestroy {

    bills: Observable<any[]>; 
    items: Observable<any[]>;
    members: Observable<any[]>;
    resumo: Observable<any[]>;
    billname: string;
    billkey: string;
    billselected: boolean = false;
    len: number = 0;
    lenI: number = 0;
    lenM: number = 0;
    lenR: number = 0;    

    sub: any;

    title: string = this.appService.language["t14"];

    constructor(
        public appService: AppService,
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
        .pipe(map(bills => {

            this.len = bills.length;

            if (localStorage.getItem('lastBill')) {
                let result = bills.find(bill => bill.payload.doc.id == localStorage.getItem('lastBill'));
                if (result != undefined) {
                    const data = result.payload.doc.data();
                    const id = result.payload.doc.id;                
                    this.onSelectBill({ id, ...(data as {}) });
                }
            }

            return bills
            //.sort(
                //(a,b) => a.payload.doc.data()["billname"].localeCompare(b.payload.doc.data()["billname"]))
            .map(bill => {                
                const data = bill.payload.doc.data();
                const id = bill.payload.doc.id;                
                return { id, ...(data as {}) };                
            })
        })); 

    }

    ngOnDestroy() {
        if (this.sub != undefined)
            this.sub.unsubscribe();
    }

    onSelectBill(b): void {

        this.billname = b.billname;
        this.billkey = b.id;
        this.billselected = true;
        this.title = b.billname;
        localStorage.setItem('lastBill', b.id);
        
        this.sub = this.appService.afs.collection('bills').doc(b.id)
        .snapshotChanges()
        .subscribe(bill => {

            let items = [];
            let members = [];
            let resumo = [];
            let total = 0;

            if (!bill.payload.exists || !bill.payload.data()["items"] || Object.keys(bill.payload.data()["items"]).length == 0) {                
                this.appService.display_error(this.appService.language.m5);
            } else {  

                for (let key in bill.payload.data()["access"]) {
                    if (key.replace(/´/g,'.') != this.appService.user.email) {
                        let format = key.replace(/´/g,'.').split("@");
                        if (format[0].length > 20)
                            format[0] = format[0].substring(0,7)+"..."+format[0].substring(format[0].length-7,7);
                        members.push({
                            email: key.replace(/´/g,'.'),
                            emailf: format[0]+"@"+format[1],
                            value: 0
                        });
                    }
                }               
                                    
                let data = bill.payload.data();
                for (let key in data["items"]) {                  
                    
                    // Only show bills that's from my interest
                    let show = false;

                    /*
                    sn = I payed to someone else
                    sp = Someone payed to me
                    ow = I'm the owner
                    my = I payed for myself
                    */

                    data["items"][key].benefited.forEach(b => {
                        let sn = data["items"][key].payer == this.appService.user.email && b != this.appService.user.email;
                        let sp = data["items"][key].payer != this.appService.user.email && b == this.appService.user.email;
                        let ow = data["items"][key].owner == this.appService.user.email;
                        let my = data["items"][key].payer == this.appService.user.email && b == this.appService.user.email;
                        if (sn || sp || ow || my) {
                            show = true;
                            if (sn || sp) {
                                members.forEach(member => {
                                    if (member.email == (sn?b:data["items"][key].payer)){
                                        let valuepp = (data["items"][key].value*(data["items"][key].multiplier != undefined?data["items"][key].multiplier:1))/data["items"][key].benefited.length;
                                        if (sn)
                                            member.value+=valuepp;
                                        else
                                            member.value-=valuepp;
                                    };
                                });
                            };
                            if (sp || my) {                               
                                let valuepp = (data["items"][key].value*(data["items"][key].multiplier != undefined?data["items"][key].multiplier:1))/data["items"][key].benefited.length;                                
                                total += valuepp;
                                let existe = false;
                                for (let v in resumo) {
                                    if (resumo[v].type == data["items"][key].type)
                                    {
                                        resumo[v].value = resumo[v].value + valuepp;
                                        resumo[v].order = 1 - resumo[v].value;
                                        existe = true;
                                    }
                                }
                                if (!existe) {
                                    resumo.push(
                                        {
                                            type: data["items"][key].type,
                                            value: valuepp,
                                            order: 1 - valuepp
                                        }
                                    );
                                }
                            };
                        };
                    });
                  
                    if (show) 
                        items.push({
                            benefited: data["items"][key].benefited,
                            date: new Date(data["items"][key].date.seconds*1000),
                            description: data["items"][key].description,
                            value: data["items"][key].value,
                            multiplier: (data["items"][key].multiplier != undefined?data["items"][key].multiplier:1),
                            calculated: data["items"][key].value*(data["items"][key].multiplier != undefined?data["items"][key].multiplier:1),
                            payer: data["items"][key].payer,
                            place: data["items"][key].place,
                            type: data["items"][key].type,
                            owner: data["items"][key].owner,
                            itemkey: key
                        });
                };
            };

            resumo.push(
                {
                    type: "t47",
                    value: total,
                    order: total
                }
            );            
            
            this.lenI = items.length;
            this.lenM = members.length;
            this.lenR = resumo.length;            

            this.members = of(members.sort((a,b) => { return a.value-b.value }));
            this.resumo = of(resumo.sort((a,b) => { return a.order-b.order }));          
           
            this.items = of(items.sort((a,b) => { 
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
                ['items.'+i.itemkey]: firestore.FieldValue.delete()
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
                amount: '',
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

        let subs = this.appService.afs.collection('bills').doc(this.billkey)
        .snapshotChanges()
        .subscribe(bill => {
            let payload = bill.payload.data();
            let now = new Date();
            let crypto = CryptoJS.AES.encrypt(JSON.stringify({
                type: "bill",
                items: payload["items"],
                access: payload["access"]
            }), environment.cryptoPass).toString();
            let data = new Blob([crypto], {type: 'text/plain'});              
            let link = document.createElement('a');
            link.href = window.URL.createObjectURL(data);
            link.setAttribute('download', 'backup_'+this.appService.language['t14'].toLowerCase()+'_'+this.billname.toLowerCase()+'_'+now.getFullYear()+now.getMonth()+now.getDate()+'.txt');
            document.body.appendChild(link);    
            link.click();
            document.body.removeChild(link);                          
            subs.unsubscribe();
        });

    }

}