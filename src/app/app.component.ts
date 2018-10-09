import { Component ,  HostBinding, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition, } from '@angular/animations';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
  // animations: [
    // animation triggers go here
  // ]
})
export class AppComponent implements OnInit {
  title = 'food-cost.io';
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.autoAuthUser();
  }
}
