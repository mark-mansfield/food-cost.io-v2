import { Component, OnInit, OnDestroy } from '@angular/core';
import { MainComponent } from '../main/main.component';
import { AppComponent } from '../app.component';
import { Location } from '@angular/common';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  private authListenerSub: Subscription;

  constructor(
    private mainComponent: MainComponent,
    private appVars: AppComponent,
    private _location: Location,
    private authService: AuthService
  ) {}

  title = this.appVars.title;

  public backClicked() {
    this._location.back();
  }

  public toggleSideNav(): void {
    this.mainComponent.toggle();
  }

  ngOnInit() {
    // set up authListener to AuthStatusListener in auth.service file
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  onLogout() {
    this.authService.logout();
  }
  ngOnDestroy() {
    this.authListenerSub.unsubscribe();
  }
}
