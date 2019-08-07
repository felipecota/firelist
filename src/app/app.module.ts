import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { HttpModule }   from '@angular/http';

import { AngularFireModule } from '@angular/fire';
import { environment } from './../environments/environment';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { HttpClientModule } from '@angular/common/http';

import { AppService } from './app.service';
import { BillService } from './app-bill/bill/bill.service';

import { ListModule } from './app-list/list/list.module';
import { BillModule } from './app-bill/bill/bill.module';

import { LoginModule } from './login/login.module';
import { AppRoutingModule } from './app.routing.module';

import { TranslatePipeModule } from './translate.module'

import { AppComponent } from './app.component';
import { MenuComponent } from './menu.component';

import { APP_BASE_HREF, LocationStrategy, HashLocationStrategy } from '@angular/common';

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
    ListModule,
    BillModule,
    LoginModule,
    AppRoutingModule,
    HttpClientModule,
    AngularFireDatabaseModule,
    AngularFireModule,
    AngularFireAuthModule,
    AngularFirestoreModule.enablePersistence(),
    AngularFireModule.initializeApp(environment.firebase)
  ],
  providers: [
    AppService, BillService,
    { provide: APP_BASE_HREF, useValue: '/' },
    { provide: LocationStrategy, useClass: HashLocationStrategy },    
  ],  
  bootstrap: [AppComponent]
})
export class AppModule { 
}
