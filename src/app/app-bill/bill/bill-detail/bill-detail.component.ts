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

  selected: boolean;
  erro: string;
  billname: string;
  billkey: string;  
 
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

  onSelectList(b): void {
    this.selected = true;
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
    });     
  }      

}