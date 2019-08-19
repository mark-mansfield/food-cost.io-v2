import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  @ViewChild('passField') passField: ElementRef;
  @ViewChild('showHide') showHide: ElementRef;

  isLoading = false;
  shown = false;
  private authStatusSub: Subscription;
  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(authStatus => {
      this.isLoading = false;
    });
  }

  togglePassword() {
    this.shown = !this.shown;
    if (this.shown) {
      this.passField.nativeElement.setAttribute('type', 'text');
      this.showHide.nativeElement.setAttribute('class', 'far fa-eye-slash');
    } else {
      this.passField.nativeElement.setAttribute('type', 'password');
      this.showHide.nativeElement.setAttribute('class', 'far fa-eye');
    }
  }

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    } else {
      this.isLoading = true;
      this.authService.login(form.value.email, form.value.password);
    }
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
