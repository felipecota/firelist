import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { firestore } from 'firebase/app';

import { AppService } from '../../app.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-bill-access',
  templateUrl: './bill-access.component.html',
  styleUrls: ['./bill-access.component.css']
})
export class BillAccessComponent implements OnInit {

  bills: Observable<any[]>;
  members: any[];
  
  selected: boolean;
  erro: string;
  billname: string;
  billkey: string;
  email: string;

  title: string = this.appService.language["t14"];
  
  constructor(
    private appService: AppService
  ) { }

  ngOnInit() {

    this.bills = this.appService.afs.collection('bills', ref => ref.where('access.'+this.appService.user.email.replace(/\./g,'´'),'==',true))
    .snapshotChanges()
    .pipe(map(bills => {

        if (localStorage.getItem('lastBill')) {
          let result = bills.find(bill => bill.payload.doc.id == localStorage.getItem('lastBill'));
          if (result != undefined) {
              const data = result.payload.doc.data();
              const id = result.payload.doc.id;                
              this.onSelectBill({ id, ...data });
          }
        }

        return bills
        .sort(
            (a,b) => a.payload.doc.data()["billname"].localeCompare(b.payload.doc.data()["billname"]))
        .map(bill => {
            const data = bill.payload.doc.data();
            const id = bill.payload.doc.id;
            return { id, ...data };          
        })
    })); 

  }

  onSelectBill(b): void {
    this.selected = true;
    this.erro = '';
    this.billname = b.billname;
    this.billkey = b.id;
    this.title = b.billname;
    localStorage.setItem('lastBill', b.id);
   
    this.appService.afs.collection('bills').doc(this.billkey)
    .snapshotChanges()
    .forEach(bill => {
      if (bill.payload.exists) {
        let temp = [];
        for (let key in bill.payload.data()["access"]) {
            let format = key.replace(/´/g,'.').split("@");
            if (format[0].length > 20)
                format[0] = format[0].substr(0,7)+"..."+format[0].substr(format[0].length-7,7);
            temp.push({
                email: key.replace(/´/g,'.'),
                emailf: format[0]+"@"+format[1]
            });
        }
        this.members = temp;
      }      
    });
         
  }    

  Include() {

    let email = this.email;

    if (this.members && this.members.length >= environment.limit)
      this.erro = this.appService.language.e18;
    else if (!navigator.onLine)
      this.erro = this.appService.language.e12;    
    else if (!email || email == '') {
      this.erro = this.appService.language.e8;
      navigator.vibrate([500]);
    } else {  
      this.appService.afs.collection('bills').doc(this.billkey).update({
          ['access.'+email.toLowerCase().replace(/\./g,'´')]: true
      });            
          
      this.erro = '';
      this.email = '';
    }
  }

  onRemove(member): void {

    if (!navigator.onLine)
      this.erro = this.appService.language.e12;
    else if (this.members.length > 1) {
      if (confirm(this.appService.language.m7))
        this.appService.afs.collection('bills').doc(this.billkey).update({
          ['access.'+member.email.replace(/\./g,'´')]: firestore.FieldValue.delete()
        });
    } else {      
      this.erro = this.appService.language.e10;      
    }

  }

}
