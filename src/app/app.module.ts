import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { HttpModule }   from '@angular/http';
import { FirebaseConfig } from './../environments/firebase.config';

import { AngularFireModule } from 'angularfire2/index';
import { AngularFireOfflineModule } from 'angularfire2-offline';
import { AngularFireDatabaseModule } from 'angularfire2/database';

import { ItemModule } from './item/item.module';
import { AppService } from './app.service'
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ItemModule,
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(FirebaseConfig),
    AngularFireOfflineModule
  ],
  providers: [AppService],
  bootstrap: [AppComponent]
})
export class AppModule { }
