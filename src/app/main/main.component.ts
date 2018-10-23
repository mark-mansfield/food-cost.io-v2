import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})

export class MainComponent implements OnInit {

  @ViewChild('sidenav') sidenav: MatSidenav;
  constructor() { }

  storedDishes = [];
  onDishAdded(dish) {
    this.storedDishes.push(dish);

  }

  public toggle() {
    this.sidenav.toggle();
  }




  ngOnInit() {
  }

}
