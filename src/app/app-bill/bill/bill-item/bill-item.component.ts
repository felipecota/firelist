import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable'
import { Router }   from '@angular/router';
import * as fs from 'firebase';

import { AppService } from '../../../app.service';

@Component({
  selector: 'app-bill-item',
  templateUrl: './bill-item.component.html',
  styleUrls: ['./bill-item.component.css']
})
export class BillItemComponent implements OnInit {

  bills: Observable<any[]>;   
  members: any[]; 

  selected_bill: boolean;
  selected_member: boolean;
  erro: string;
  billname: string;
  billkey: string; 
  payer: string;

  date: Date;
  description: string;
  value: string;
  benefited: any;
 
  constructor(
    private appService: AppService,
    private router: Router
  ) { }

  ngOnInit() {

    this.date = new Date();

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

  onSelectMember(m): void {
    this.selected_member = true;
    this.payer = m.email;
  }

  onSelectBill(b): void {

    this.selected_bill = true;
    this.erro = '';
    this.billname = b.billname;
    this.billkey = b.id;
    
    this.appService.afs.collection('bills').doc(this.billkey)
    .snapshotChanges()
    .forEach(list => {
      let temp = [];
      for (let key in list.payload.data().access) {
          temp.push({
              email: key.replace('`','.')
          });
      }
      this.members = temp;
    }); 

  }
  
  Include() { 

        let date = this.date;
        let description = this.description;
        let value = Number(this.value.replace(',','.'));
        let payer = this.payer;
        let benefited = this.benefited;

        if (!date || !description || description.trim() == '' || !value || value == NaN || value <= 0 || !benefited || benefited.length == 0)  {

            this.erro = this.appService.language.e14;
            navigator.vibrate([500]);

        } else {  
            
            this.date = new Date();
            this.description = '';
            this.value = '';
            this.payer = '';
            this.benefited = '';

            let d = new Date();
            let itemkey = d.getFullYear()+''+d.getMonth()+''+d.getDay()+''+d.getHours()+''+d.getMinutes()+''+d.getSeconds()+''+(Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000);
            
            this.appService.afs.collection('bills').doc(this.billkey).update({
                ['items.'+itemkey]: {
                    payer: payer,
                    benefited: benefited,
                    date: date.getTime(),
                    description: description,
                    value: value
                }
            })

            this.erro = '';
            this.router.navigate(['/bill-detail']);                            

        }   
    }  

}