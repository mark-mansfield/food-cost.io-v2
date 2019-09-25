import { Injectable } from '@angular/core';
import { forkJoin } from 'rxjs'; // RxJS 6 syntax
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { Globals } from '../globals';
import { environment } from '../../environments/environment';
const BACKEND_URL = environment.apiUrl;

// @Injectable({ providedIn: 'root' })
@Injectable()
export class AuthService {
  private token: string;
  private isAuthenticated = false;
  public isFirstTime: boolean;
  private tokenTimer: any;
  private custId: string;
  public account: any;
  expiresInDuration = null;

  // prevent user from being logged out with a manual page reload (we store a token in localStorage) see: autoAuthUser()
  // bounce user after one hour using tokenTimer
  // Subject push the authentication status to interested components
  // return the observable, we just push a boolean from here to the  other parties
  private authStatusListener = new Subject<boolean>();

  public accountStatus = new Subject<String>();

  constructor(private http: HttpClient, private router: Router, private globalService: Globals) { }

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getCustomerData() {
    return this.custId;
  }

  getAccountStatusListener() {
    return this.accountStatus.asObservable();
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (authInformation == null) {
      this.router.navigate(['/login']); /* navigate to login page */
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  createUser(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password
      // custID: email
    };

    return this.http.post<{ userId: string }>('http://localhost:3000/api/users/createUser', authData).subscribe(
      response => {
        console.log(response);
        this.router.navigate(['/login']);
      },
      error => {
        this.authStatusListener.next(false);
      }
    );
  }

  login(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password
      // custID: null
    };
    this.http
      .post<{ token: string; expiresIn: string; userId: string; firstTime: boolean }>(
        BACKEND_URL + 'users/login',
        authData
      )
      .subscribe(
        response => {
          // store token and activation status for later use
          const token = response.token;
          const firstLogin = response.firstTime;
          this.token = token;
          this.isFirstTime = firstLogin;
          this.custId = response.userId;

          if (token) {
            this.globalService.setCustomer(response);
            this.custId = response.userId;
            this.expiresInDuration = response.expiresIn;

            this.setAuthTimer(this.expiresInDuration);
            this.authStatusListener.next(true);
            this.isAuthenticated = true;

            const now = new Date();
            const expirationDate = new Date(now.getTime() + this.expiresInDuration * 1000);

            // handles a first time login edge case
            if (this.isFirstTime) {
              this.initCustomerDocs(token, expirationDate, firstLogin, this.custId);
            }

            console.log(`customer documents created already exist: forwarding to homepage`);
            this.saveAuthData(token, expirationDate, firstLogin, this.custId);
            this.router.navigate(['/homepage']);
          }
        },
        error => {
          this.authStatusListener.next(false); /* push status to entire app */
        }
      );
  }

  initCustomerDocs(token, expirationDate, firstLogin, custId) {
    const customer = {
      customerId: custId
    };

    console.log('creating customer documents');
    console.log(custId);
    const userMenusDoc = this.http.post(BACKEND_URL + 'accountServices/initMenuDoc', customer);
    const userIngredientsDoc = this.http.post(BACKEND_URL + 'accountServices/initIngredientsDoc', customer);
    const userSuppliersDoc = this.http.post(BACKEND_URL + 'accountServices/initSuppliersDoc', customer);
    const userDishesDoc = this.http.post(BACKEND_URL + 'accountServices/initDishesDoc', customer);
    const userAccountValidated = this.http.post(BACKEND_URL + 'accountServices/validateAccount', customer);

    forkJoin([userMenusDoc, userIngredientsDoc, userDishesDoc, userSuppliersDoc, userAccountValidated]).subscribe(
      results => {
        console.log('creating customer documents results');
        console.log(results);
        this.saveAuthData(token, expirationDate, firstLogin, custId);
      }
    );
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.router.navigate(['/login']); /* navigate to landing page */
    this.clearAuthData();
    this.clearCustomerData();
    clearTimeout(this.tokenTimer);
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  public getAccountData() {
    return this.getAuthData();
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const inactive = JSON.parse(localStorage.getItem('firstLogin'));
    const custId: string = localStorage.getItem('custId');
    if (!token || !expirationDate === null) {
      return;
    } else {
      return {
        token: token,
        expirationDate: new Date(expirationDate),
        inactive: inactive,
        custId: custId
      };
    }
  }

  private saveAuthData(token: string, expirationDate: Date, firstLogin: Boolean, custId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('firstLogin', JSON.stringify(firstLogin));
    localStorage.setItem('custId', custId);
    return true;
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('firstLogin');
    localStorage.removeItem('custId');
    localStorage.removeItem('iqf1efs');
  }

  private clearCustomerData() {
    localStorage.removeItem('customer');
    localStorage.removeItem('ingredients');
    localStorage.removeItem('ingredient');
    localStorage.removeItem('dishes');
    localStorage.removeItem('menus');
  }
}
