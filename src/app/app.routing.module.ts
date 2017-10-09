import { NgModule, ModuleWithProviders } from '@angular/core';
import { 
    Routes, RouterModule, 
    CanActivate, Router,
    RouterStateSnapshot, ActivatedRouteSnapshot,
    ActivatedRoute, Params
} from '@angular/router';
import { Injectable } from '@angular/core';

import { LoginFormComponent } from './login/login-form/login-form.component';
import { ListDetailComponent } from './list/list-detail/list-detail.component';
import { ListFormComponent } from './list/list-form/list-form.component';
import { ListAccessComponent } from './list/list-access/list-access.component';
import { ItemFormComponent } from './item/item-form/item-form.component';

import { AppService } from './app.service';

@Injectable()
export class AuthGuard implements CanActivate {
  
  constructor(
      private appService: AppService, 
      private router: Router,
      private route: ActivatedRoute
    ) {}    

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.appService.isSignin) {
        return true;
    } else {
        this.router.navigate(['/login']);        
        this.appService.returnUrl = state.url;
        return false;    
    }
  }
}

const APP_ROUTES: Routes = [
    { path: '', redirectTo: '/list-detail', pathMatch: 'full' },
    { path: 'login', component: LoginFormComponent },
    { path: 'list-detail', component: ListDetailComponent, canActivate:[AuthGuard] },
    { path: 'list-form', component: ListFormComponent, canActivate:[AuthGuard] },
    { path: 'list-access', component: ListAccessComponent, canActivate:[AuthGuard] },
    { path: 'item-form', component: ItemFormComponent, canActivate:[AuthGuard] }
]

@NgModule({
    imports: [
        RouterModule.forRoot(APP_ROUTES)
    ],
    exports: [RouterModule],
    providers: [AuthGuard]
})

export class AppRoutingModule { }