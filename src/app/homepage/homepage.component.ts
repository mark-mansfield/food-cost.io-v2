import { Component, OnInit } from '@angular/core';
import { MenusService } from '../menus/menus.service';
import { AuthService } from '../auth/auth.service';

import { Subscription } from 'rxjs';
import { Menu } from '../menus/menu.model';
import { Dish } from '../dishes/dish.model';
import { DishService } from '../dishes/dish.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  public customer: any;
  public menusSub: Subscription;
  public dishesSub: Subscription;
  public menus: Menu[] = [];
  public dishes: Dish[] = [];

  constructor(private authService: AuthService, public menuService: MenusService, public dishService: DishService) {}

  ngOnInit() {
    this.customer = this.authService.getAccountData();
    this.menuService.getMenus();
    this.dishService.getDishData();

    this.dishesSub = this.dishService.getDishesUpdateListener().subscribe((dishes: Dish[]) => {
      this.dishes = dishes;
      console.log(this.dishes);
    });

    this.menusSub = this.menuService.getMenusUpdateListener().subscribe((data: Menu[]) => {
      this.menus = data;
      console.log(this.menus);
    });
  }
}
