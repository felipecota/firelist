import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable'
import * as fs from 'firebase';

import { AppService } from '../../../app.service';

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
  
  constructor(
    private appService: AppService,
    private afAuth: AngularFireAuth
  ) { }

  ngOnInit() {

    this.bills = this.appService.afs.collection('bills', ref => ref.where('access.'+this.appService.user.email.replace(/\./g,'´'),'==',true))
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
              email: key.replace(/´/g,'.')
          });
      }
      this.members = temp;
    });     
  }    

  Include() {

    let email = this.email;

    // I neeed connection to check email
    if (!navigator.onLine)
      this.erro = this.appService.language.e12;    
    else if (email == '') {
      this.erro = this.appService.language.e8;
      navigator.vibrate([500]);
    } else {  

        // Check if e-mail is already in the list
        this.afAuth.auth.fetchProvidersForEmail(email)
        .then(providers => { 
          if (providers.length == 0) {
              this.erro = this.appService.language.e8
          } else {

            this.appService.afs.collection('bills').doc(this.billkey).update({
                ['access.'+email.replace(/\./g,'´')]: true
            });            
                
            this.erro = '';
            this.email = '';
          }}
        );
    }
  }

  onRemove(member): void {

    if (!navigator.onLine)
      this.erro = this.appService.language.e12;
    else if (this.members.length > 1)
      this.appService.afs.collection('bills').doc(this.billkey).update({
        ['access.'+member.email.replace(/\./g,'´')]: fs.firestore.FieldValue.delete()
      });
    else {
      this.erro = this.appService.language.e10;      
    }

  }

}
