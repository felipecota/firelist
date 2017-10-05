import { NgModule, ModuleWithProviders } from '@angular/core';
import { 
    Routes, RouterModule, 
    CanActivate, Router,
    RouterStateSnapshot, ActivatedRouteSnapshot 
} from '@angular/router';
import { Injectable } from '@angular/core';

import { LoginFormComponent } from './login/login-form/login-form.component';
import { ListComponent } from './item/list/list.component';
import { FormComponent } from './item/form/form.component';

import { AppService } from './app.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private appService: AppService, private router: Router) {}    

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    //console.log("url", state.url);
    if (this.appService.isSignin) {
        return true;
    } else {
        this.router.navigate(['']);
        return false;    
    }
  }
}

const APP_ROUTES: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginFormComponent },
    { path: 'list', component: ListComponent, canActivate:[AuthGuard] },
    { path: 'form', component: FormComponent, canActivate:[AuthGuard] }
]

@NgModule({
    imports: [
        RouterModule.forRoot(APP_ROUTES)
    ],
    exports: [RouterModule],
    providers: [AuthGuard]
})

export class AppRoutingModule { }