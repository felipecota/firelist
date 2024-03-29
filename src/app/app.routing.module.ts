import { NgModule } from '@angular/core';
import { 
    Routes, RouterModule, 
    CanActivate, Router,
    RouterStateSnapshot, ActivatedRouteSnapshot
} from '@angular/router';
import { Injectable } from '@angular/core';

import { MenuComponent } from './menu.component';

import { SettingsFormComponent } from './settings/settings-form/settings-form.component';
import { DeleteFormComponent } from './settings/delete-form/delete-form.component';

import { LoginFormComponent } from './login/login-form/login-form.component';
import { ListDetailComponent } from './app-list/list-detail/list-detail.component';
import { ListFormComponent } from './app-list/list-form/list-form.component';
import { ListAccessComponent } from './app-list/list-access/list-access.component';
import { ListItemComponent } from './app-list/list-item/list-item.component';

import { BillFormComponent } from './app-bill/bill-form/bill-form.component';
import { BillAccessComponent } from './app-bill/bill-access/bill-access.component';
import { BillItemComponent } from './app-bill/bill-item/bill-item.component';
import { BillDetailComponent } from './app-bill/bill-detail/bill-detail.component';

import { AppService } from './app.service';

@Injectable()
export class AuthGuard implements CanActivate {
  
  constructor(
      private appService: AppService, 
      private router: Router
    ) {}    

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.appService.isSignin) {
        localStorage.setItem('lastroute', state.url);
        return true;
    } else {
        this.router.navigate(['/login']);        
        return false;    
    }
  }
}

const APP_ROUTES: Routes = [
    { path: '', redirectTo: '/menu', pathMatch: 'full' },
    { path: 'login', component: LoginFormComponent },
    { path: 'delete', component: DeleteFormComponent },
    { path: 'menu', component: MenuComponent, canActivate:[AuthGuard] },
    { path: 'settings', component: SettingsFormComponent, canActivate:[AuthGuard] },
    { path: 'list-detail', component: ListDetailComponent, canActivate:[AuthGuard] },
    { path: 'list-form', component: ListFormComponent, canActivate:[AuthGuard] },
    { path: 'list-access', component: ListAccessComponent, canActivate:[AuthGuard] },
    { path: 'list-item', component: ListItemComponent, canActivate:[AuthGuard] },
    { path: 'list-item/:data', component: ListItemComponent, canActivate:[AuthGuard] },    
    { path: 'bill-form', component: BillFormComponent, canActivate:[AuthGuard] },    
    { path: 'bill-access', component: BillAccessComponent, canActivate:[AuthGuard] },
    { path: 'bill-item', component: BillItemComponent, canActivate:[AuthGuard] },
    { path: 'bill-item/:data', component: BillItemComponent, canActivate:[AuthGuard] },
    { path: 'bill-detail', component: BillDetailComponent, canActivate:[AuthGuard] },
    { path: 'bill-detail/:id1/:id2', component: BillDetailComponent, canActivate:[AuthGuard] }
]

@NgModule({
    imports: [
        RouterModule.forRoot(APP_ROUTES)
    ],
    exports: [RouterModule],
    providers: [AuthGuard]
})

export class AppRoutingModule { }