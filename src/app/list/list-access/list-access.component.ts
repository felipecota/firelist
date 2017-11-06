import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';

import { AppService } from '../../app.service';

@Component({
  selector: 'app-list-access',
  templateUrl: './list-access.component.html',
  styleUrls: ['./list-access.component.css']
})
export class ListAccessComponent implements OnInit {

  access: any[];
  members: any[];
  selected: boolean;
  erro: string;
  listname: string;
  listkey: string;
  
  constructor(
    private appService: AppService,
    private afAuth: AngularFireAuth
  ) { }

  ngOnInit() {
    this.appService.db.list('/access', {
      query: {
        orderByChild: 'email',
        equalTo: this.appService.user.email
      }
    }).subscribe(access => {
      this.access = access.sort((a,b) => a.listname.localeCompare(b.listname));
    });  
  }

  onSelectList(key, listname, items): void {
    this.selected = true;
    this.erro = '';
    this.listname = listname;
    this.listkey = key; 
    this.appService.db.list('/access', {
      query: {
        orderByChild: 'listkey',
        equalTo: this.listkey
      }
    }).subscribe(members => {
      this.members = members.sort((a,b) => a.listname.localeCompare(b.listname));
}); 
       
  }    

  form_submit(f: NgForm) {
    if (!navigator.onLine)
      this.erro = this.appService.language.e12;
    else if (f.controls.email.value == '') {
      this.erro = this.appService.language.e8;
      navigator.vibrate([500]);
    } else {  

      let member_exists = false;
      let item_exists = false;

      for(let i of this.members) {
        if (i.email == f.controls.email.value)
          member_exists = true;
      }

      if (member_exists)
        this.erro = this.appService.language.e8;
      else {
        // Check if e-mail is already in the list
        this.afAuth.auth.fetchProvidersForEmail(f.controls.email.value)
        .then(providers => { 
          if (providers.length == 0) {
              this.erro = this.appService.language.e8
          } else {
              let email = f.controls.email.value;
              this.appService.db.list('/access').push(
                {
                    listname: this.listname,
                    listkey: this.listkey,
                    email: email
                }
              );    
              this.appService.db.list('/items', {
                query: {
                    orderByChild: 'email',
                    equalTo: this.appService.user.email
                }
              }).take(1).forEach(items => {
                  items.forEach(e => {
                    if (e.listkey == this.listkey)
                      this.appService.db.list('/items').push({
                        amount: e.amount,
                        email: email,
                        itemkey: e.itemkey,
                        itemname: e.itemname,
                        listkey: e.listkey
                      });
                  });
              });                 
              this.erro = '';
              f.controls.email.setValue('');
          }}
        ) 
        .catch(error => { 
          console.log(error);
          this.erro = this.appService.language.e8 
        });
      }
    }
  }

  onRemove(key, email): void {
      if (this.members.length > 1) {  
        // Remove access
        this.appService.db.list('/access').remove(key).then(() => console.log('members removed: ' + key)),
          (e: any) => console.log(e.message);

        // Remove items
        this.appService.db.list('/items', {
          query: {
              orderByChild: 'email',
              equalTo: email
          }
        }).take(1).forEach(items => {
            items.forEach(e => {
              if (e.listkey == this.listkey) {
                this.appService.db.list('/items').remove(e.$key);
              }
            });
        });            
      } else
        this.erro = this.appService.language.e10;
  }

}
