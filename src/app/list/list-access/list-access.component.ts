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

  lists: any[];
  access: any[];
  t3: string;
  t5: string;
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
    this.appService.access.subscribe(access => this.access = access);
    this.appService.lists.subscribe(lists => this.lists = lists);
    this.t3 = language.t3;
    this.t5 = language.t5;
  }

  onSelectList(key, listname): void {
    this.selected = true;
    this.erro = '';
    this.listname = listname;
    this.listkey = key;
  }    

  search(): boolean {
    return false;
  }
 
  form_submit(f: NgForm) { 
    if (f.controls.email.value == '') {
      this.erro = language.e8;
      navigator.vibrate([500]);
    //} else if (f.controls.email.value == this.appService.user.email) {
      //this.erro = language.e8;
    //} else if (this.access.filter(item => { return item.email == f.controls.email.value }).length > 0) {
      //this.erro = language.e9;
    } else {  
      this.afAuth.auth.fetchProvidersForEmail(f.controls.email.value)
        .then(providers => { 
          if (providers == '') {
            this.erro = language.e8
              } else {
                this.appService.lists.update(this.listkey,
                  {
                    members: {
                      [providers.uid]: true
                    }
                  }
                )

                /*
            this.appService.access.push(
              {
                  list: this.listkey,
                  email: f.controls.email.value
              }
            ).then((t: any) => console.log(t.key)),
            (e: any) => console.log(e.message);*/
            this.erro = '';
            f.controls.email.setValue('');
          }}
        ) 
        .catch(error => { 
          this.erro = language.e8 });
    } 
  }

  onRemove(key): void {
    this.appService.access.remove(key).then(() => console.log('access removed: ' + key)),
        (e: any) => console.log(e.message);
  }

}
