import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { HttpModule }   from '@angular/http';
import { FirebaseConfig } from './../environments/firebase.config';

import { AngularFireModule } from 'angularfire2/index';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFirestoreModule } from 'angularfire2/firestore';

import { AppService } from './app.service'

import { ItemModule } from './app-list/item/item.module';
import { ListModule } from './app-list/list/list.module';

import { BillModule } from './app-bill/bill/bill.module';

import { LoginModule } from './login/login.module';
import { AppRoutingModule } from './app.routing.module';

import { TranslatePipeModule } from './translate.module'

import { AppComponent } from './app.component';
import { MenuComponent } from './menu.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent      
  ],
  imports: [   
    TranslatePipeModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    ItemModule,
    ListModule,
    BillModule,
    LoginModule,
    AppRoutingModule,
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(FirebaseConfig),
    AngularFirestoreModule.enablePersistence()
  ],
  providers: [AppService],
  bootstrap: [AppComponent]
})
export class AppModule { }
