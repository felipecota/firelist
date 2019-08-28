import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { HttpModule }   from '@angular/http';
import { DatePipe } from '@angular/common'

import { AngularFireModule } from '@angular/fire';
import { environment } from './../environments/environment';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { HttpClientModule } from '@angular/common/http';

import { AppService } from './app.service';
import { BillService } from './app-bill/bill.service';

import { ListModule } from './app-list/list.module';
import { BillModule } from './app-bill/bill.module';
import { SettingsModule } from './settings/settings.module';

import { LoginModule } from './login/login.module';
import { AppRoutingModule } from './app.routing.module';

import { TranslatePipeModule } from './translate.module'

import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { MenuComponent } from './menu.component';

//import { APP_BASE_HREF, LocationStrategy, HashLocationStrategy } from '@angular/common';

declare var Hammer: any;

export class MyHammerConfig extends HammerGestureConfig  {
  buildHammer(element: HTMLElement) {
    let mc = new Hammer(element, {
      touchAction: "pan-y"
    });
    return mc;
  }
}

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
    SettingsModule,
    LoginModule,
    AppRoutingModule,
    HttpClientModule,
    AngularFireDatabaseModule,
    AngularFireModule,
    AngularFireAuthModule,
    AngularFirestoreModule.enablePersistence({synchronizeTabs:true}),
    AngularFireModule.initializeApp(environment.firebase)
  ],
  providers: [
    AppService, BillService, DatePipe,
  //  { provide: APP_BASE_HREF, useValue: '/' },
  //  { provide: LocationStrategy, useClass: HashLocationStrategy },    
    {
      // hammer instantion with custom config
      provide: HAMMER_GESTURE_CONFIG,
      useClass: MyHammerConfig ,
    }
  ],  
  bootstrap: [AppComponent]
})
export class AppModule { 
}
