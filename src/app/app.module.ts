import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { HttpModule }   from '@angular/http';

import { AppComponent } from './app.component';

import { FirebaseConfig } from './../environments/firebase.config';
import { AngularFireModule } from 'angularfire2/index';

import { PeopleModule } from './people/people.module';

import { AppService } from './app.service'

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    PeopleModule,
    AngularFireModule.initializeApp(FirebaseConfig)
  ],
  providers: [AppService],
  bootstrap: [AppComponent]
})
export class AppModule { }
