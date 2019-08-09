import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service'
import { languages } from '../../../environments/language';

@Component({
  selector: 'app-settings',
  templateUrl: './settings-form.component.html',
  styleUrls: ['./settings-form.component.css']
})
export class SettingsFormComponent implements OnInit {

  languages: any[];

  constructor(
    public appService: AppService
  ) {   
  }

  ngOnInit() {
    this.languages = languages;
  }

  language(lang) {
    this.appService.language_set(lang);
  } 

}
