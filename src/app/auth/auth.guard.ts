
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '../../../node_modules/@angular/router';

import { Observable} from 'rxjs';
import { Injectable } from '../../../node_modules/@angular/core';
import { AuthService } from './auth.service';
import { Router } from '../../../node_modules/@angular/router';
@Injectable()

//
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    const isAuth = this.authService.getIsAuth();
    // console.log('isAuth is set to : ' + isAuth);

    //  so a user cannot access route via the address bar if they are not logged in.
    if (!isAuth) {
      this.router.navigate(['/login']);
    }
    return isAuth;
  }
}
