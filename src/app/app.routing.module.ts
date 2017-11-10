import { NgModule, ModuleWithProviders } from '@angular/core';
import { 
    Routes, RouterModule, 
    CanActivate, Router,
    RouterStateSnapshot, ActivatedRouteSnapshot,
    ActivatedRoute, Params
} from '@angular/router';
import { Injectable } from '@angular/core';

import { LoginFormComponent } from './login/login-form/login-form.component';
import { ListDetailComponent } from './app-list/list/list-detail/list-detail.component';
import { ListFormComponent } from './app-list/list/list-form/list-form.component';
import { ListAccessComponent } from './app-list/list/list-access/list-access.component';
import { ItemFormComponent } from './app-list/item/item-form/item-form.component';

import { MenuComponent } from './menu.component';

import { BillFormComponent } from './app-bill/bill/bill-form/bill-form.component';
import { BillAccessComponent } from './app-bill/bill/bill-access/bill-access.component';
import { BillItemComponent } from './app-bill/bill/bill-item/bill-item.component';

import { AppService } from './app.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthGuard implements CanActivate {
  
  constructor(
      private appService: AppService, 
      private router: Router,
      private route: ActivatedRoute
    ) {}    

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.appService.returnUrl = state.url;
    if (this.appService.isSignin) {
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
    { path: 'menu', component: MenuComponent, canActivate:[AuthGuard] },
    { path: 'list-detail', component: ListDetailComponent, canActivate:[AuthGuard] },
    { path: 'list-form', component: ListFormComponent, canActivate:[AuthGuard] },
    { path: 'list-access', component: ListAccessComponent, canActivate:[AuthGuard] },
    { path: 'item-form', component: ItemFormComponent, canActivate:[AuthGuard] },
    { path: 'bill-form', component: BillFormComponent, canActivate:[AuthGuard] },    
    { path: 'bill-access', component: BillAccessComponent, canActivate:[AuthGuard] },
    { path: 'bill-item', component: BillItemComponent, canActivate:[AuthGuard] }
]

@NgModule({
    imports: [
        RouterModule.forRoot(APP_ROUTES)
    ],
    exports: [RouterModule],
    providers: [AuthGuard]
})

export class AppRoutingModule { }