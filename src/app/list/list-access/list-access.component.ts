import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';

import { AppService } from '../../app.service';
import { language } from '../../../environments/language';

@Component({
  selector: 'app-list-access',
  templateUrl: './list-access.component.html',
  styleUrls: ['./list-access.component.css']
})
export class ListAccessComponent implements OnInit {

  access: any[];
  members: any[];
  t3: string;
  t5: string;
  selected: boolean;
  erro: string;
  listname: string;
  listkey: string;
  ilength: number;

  constructor(
    private appService: AppService,
    private afAuth: AngularFireAuth
  ) { }

  ngOnInit() {
    this.appService.afoDatabase.list('/access', {
      query: {
        orderByChild: 'email',
        equalTo: this.appService.user.email
      }
    }).subscribe(lists => {
       this.access = lists;
      });  
    this.t3 = language.t3;
    this.t5 = language.t5;
  }

  onSelectList(key, listname, items): void {
    this.selected = true;
    this.erro = '';
    this.listname = listname;
    this.listkey = key; 
    this.appService.afoDatabase.list('/access', {
      query: {
        orderByChild: 'listkey',
        equalTo: this.listkey
      }
    }).subscribe(members => this.members = members);    
    this.appService.afoDatabase.list('/items', {            
        query: {
            orderByChild: 'listkey',
            equalTo: key
        }
    }).subscribe(data => this.ilength = data.length);   
  }    

  form_submit(f: NgForm) {
    if (this.ilength > 0)
      this.erro = language.e11;
    else if (!navigator.onLine)
      this.erro = language.e12;
    else if (f.controls.email.value == '') {
      this.erro = language.e8;
      navigator.vibrate([500]);
    } else {  

      let member_exists = false;
      let item_exists = false;

      for(let i of this.members) {
        if (i.email == f.controls.email.value)
          member_exists = true;
      }

      if (member_exists)
        this.erro = language.e8;
      else {
        // Check if e-mail is already in the list
        this.afAuth.auth.fetchProvidersForEmail(f.controls.email.value)
        .then(providers => { 
          if (providers.length == 0) {
              this.erro = language.e8
          } else {
              this.appService.afoDatabase.list('/access').push(
                {
                    listname: this.listname,
                    listkey: this.listkey,
                    email: f.controls.email.value
                }
              );              
              this.erro = '';
              f.controls.email.setValue('');
          }}
        ) 
        .catch(error => { 
          console.log(error);
          this.erro = language.e8 
        });
      }
    }
  }

  onRemove(key): void {
      if (this.members.length > 1)    
        this.appService.afoDatabase.list('/access').remove(key).then(() => console.log('members removed: ' + key)),
          (e: any) => console.log(e.message);
      else
        this.erro = language.e10;
  }

}
