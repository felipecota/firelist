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
  place: string;
  type: string;

  date: string;
  description: string;
  value: string;
  benefited: any;
 
  constructor(
    private appService: AppService,
    private router: Router
  ) { }

  ngOnInit() {

    let d = new Date();
    this.date = d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();

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
    .forEach(bill => {
      let temp = [];
      for (let key in bill.payload.data().access) {
          temp.push({
              email: key.replace('`','.')
          });
      }
      this.members = temp;
    }); 

  }
  
  Include() { 

        if (!this.date || !this.description || this.description.trim() == '' || !this.value || Number(this.value) == NaN || Number(this.value) <= 0 || !this.benefited || this.benefited.length == 0 || !this.place || !this.type || this.type == "")  {

            this.erro = this.appService.language.e14;
            navigator.vibrate([500]);

        } else {  

            let date = this.date;
            let description = this.description;
            let value = this.value.replace(',','.');
            let payer = this.payer;
            let benefited = this.benefited; 
            let place = this.place;
            let type = this.type;           
            
            let d = new Date();
            this.date = d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
            this.description = '';
            this.value = '';
            this.payer = '';
            this.benefited = '';
            this.place = '';
            this.type = '';

            let itemkey = d.getFullYear()+''+d.getMonth()+''+d.getDate()+''+d.getHours()+''+d.getMinutes()+''+d.getSeconds()+''+(Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000);

            this.appService.afs.collection('bills').doc(this.billkey).update({
                ['items.'+itemkey]: {
                    payer: payer,
                    benefited: benefited,
                    date: new Date(Number(date.substring(0,4)), Number(date.substring(5,7))-1, Number(date.substring(8,10))),
                    description: description,
                    value: Number(value),
                    place: place,
                    type: type,
                    owner: this.appService.user.email
                }
            })

            this.erro = '';
            //this.router.navigate(['/bill-detail/'+this.billkey+'/'+this.billname]);

        }   
    }  

}