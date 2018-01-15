import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable'
import * as fs from 'firebase';

import { AppService } from '../../../app.service';

@Component({
  selector: 'app-list-access',
  templateUrl: './list-access.component.html',
  styleUrls: ['./list-access.component.css']
})
export class ListAccessComponent implements OnInit {

  lists: Observable<any[]>;
  members: any[];
  
  selected: boolean;
  erro: string;
  listname: string;
  listkey: string;
  email: string;
  
  constructor(
    private appService: AppService,
    private afAuth: AngularFireAuth
  ) { }

  ngOnInit() {

    this.lists = this.appService.afs.collection('lists', ref => ref.where('access.'+this.appService.user.email.replace('.','`'),'==',true))
    .snapshotChanges()
    .map(lists => {
        return lists
        .sort(
            (a,b) => a.payload.doc.data().listname.localeCompare(b.payload.doc.data().listname))
        .map(list => {
            const data = list.payload.doc.data();
            const id = list.payload.doc.id;                
            return { id, ...data };                
        })
    }); 

  }

  onSelectList(l): void {
    this.selected = true;
    this.erro = '';
    this.listname = l.listname;
    this.listkey = l.id;
    
    this.appService.afs.collection('lists').doc(this.listkey)
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

    let email = this.email;

    // I neeed connection to check email
    if (!navigator.onLine)
      this.erro = this.appService.language.e12;    
    else if (!email || email == '') {
      this.erro = this.appService.language.e8;
      navigator.vibrate([500]);
    } else {  

        // Check if e-mail is already in the list
        this.afAuth.auth.fetchProvidersForEmail(email)
        .then(providers => { 
          if (providers.length == 0) {
              this.erro = this.appService.language.e8
          } else {
              this.appService.afs.collection('lists').doc(this.listkey).update({
                  ['access.'+email.replace('.','`')]: true
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
    else if (this.members.length > 1) {
      if (confirm(this.appService.language.m7))
        this.appService.afs.collection('lists').doc(this.listkey).update({
          ['access.'+member.email.replace('.','`')]: fs.firestore.FieldValue.delete()
        });
    } else {
      this.erro = this.appService.language.e10;      
    }

  }

}
