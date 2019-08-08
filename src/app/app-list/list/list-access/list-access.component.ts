import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { firestore } from 'firebase/app';

import { AppService } from '../../../app.service';
import { environment } from '../../../../environments/environment';

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
    private appService: AppService
  ) { }

  ngOnInit() {

    this.lists = this.appService.afs.collection('lists', ref => ref.where('access.'+this.appService.user.email.replace('.','`'),'==',true))
    .snapshotChanges()
    .pipe(map(lists => {
        return lists
        .sort(
            (a,b) => a.payload.doc.data()["listname"].localeCompare(b.payload.doc.data()["listname"]))
        .map(list => {
            const data = list.payload.doc.data();
            const id = list.payload.doc.id;                
            return { id, ...data };                
        })
    })); 

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
      for (let key in list.payload.data()["access"]) {
          temp.push({
              email: key.replace('`','.')
          });
      }
      this.members = temp;
    });  
      
  }    

  Include() {

    let email = this.email;

    if (this.members.length >= environment.limit)
      this.erro = this.appService.language.e18;
    else if (!navigator.onLine)
      this.erro = this.appService.language.e12;    
    else if (!email || email == '') {
      this.erro = this.appService.language.e8;
      navigator.vibrate([500]);
    } else {  
      this.appService.afs.collection('lists').doc(this.listkey).update({
          ['access.'+email.toLowerCase().replace('.','`')]: true
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
        this.appService.afs.collection('lists').doc(this.listkey).update({
          ['access.'+member.email.replace('.','`')]: firestore.FieldValue.delete()
        });
    } else {
      this.erro = this.appService.language.e10;      
    }

  }

}
