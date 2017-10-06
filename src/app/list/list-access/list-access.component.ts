import { Component, OnInit } from '@angular/core';
import { AfoListObservable } from 'angularfire2-offline/database';

import { AppService } from '../../app.service';
import { language } from '../../../environments/language';

@Component({
  selector: 'app-list-access',
  templateUrl: './list-access.component.html',
  styleUrls: ['./list-access.component.css']
})
export class ListAccessComponent implements OnInit {

  lists: AfoListObservable<any[]>;
  t5: string;
  selected: boolean;
  erro: string;
  listname: string;
  listkey: string;

  constructor(
    private appservice: AppService
  ) { }

  ngOnInit() {
    this.lists = this.appservice.lists;
    this.t5 = language.t5;
  }

  onSelect(key, listname): void {
    this.selected = true;
    this.erro = '';
    this.listname = listname;
    this.listkey = key;
  }     

}
