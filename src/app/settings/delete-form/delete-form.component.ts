import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { auth } from 'firebase/app';

@Component({
  selector: 'app-delete-form',
  templateUrl: './delete-form.component.html',
  styleUrls: ['./delete-form.component.css']
})
export class DeleteFormComponent implements OnInit {

  erro: string;
  email: string; 

  constructor(
    private appService: AppService
  ) { }

  ngOnInit() {
  }

  forgot() {
    if (!this.email)  {
      this.erro = this.appService.language.e3;
      navigator.vibrate([500]);
    } else {
      auth().useDeviceLanguage(); 
      this.appService.afAuth.auth.sendPasswordResetEmail(this.email).then(() => {
        this.erro = this.appService.language.m3;
      }).catch((err) => {
        this.erro = this.appService.language.e13;
      });
    }
  }  

}
