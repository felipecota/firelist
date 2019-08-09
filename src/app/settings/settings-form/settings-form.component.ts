import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service'

@Component({
  selector: 'app-settings',
  templateUrl: './settings-form.component.html',
  styleUrls: ['./settings-form.component.css']
})
export class SettingsFormComponent implements OnInit {

  constructor(
    public appService: AppService
  ) {   
  }

  ngOnInit() {
  }

  language(lang) {
    this.appService.language_set(lang);
  } 

}
