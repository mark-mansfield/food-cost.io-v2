import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Menu } from './menu.model';
import { DishService } from '../dishes/dish.service';
import { Dish } from '../dishes/dish.model';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { Globals } from '../globals';
import { v4 as uuid } from 'uuid';
import { MatSnackBar } from '@angular/material';
const BACKEND_URL = environment.apiUrl + 'menus';

@Injectable({
  providedIn: 'root'
})
export class MenusService {
  public menu: Menu;
  public menuList: any = [];
  public menusDoc;
  public menusUpdated = new Subject<Menu[]>();
  public dishesOnMenuUpdated = new Subject<Dish[]>();

  constructor(
    private http: HttpClient,
    private router: Router,
    public globals: Globals,
    private dishService: DishService,
    private messageSnackBar: MatSnackBar
  ) {}

  getMenusUpdateListener() {
    return this.menusUpdated.asObservable();
  }

  dishesOnMenuUpdateListener() {
    return this.dishesOnMenuUpdated.asObservable();
  }

  getUuid() {
    return uuid();
  }
  // Menus list - ALL
  getMenus() {
    const customer = this.globals.getCustomer();
    this.http.get<{ menus: any[] }>(BACKEND_URL + '/' + customer.id).subscribe(returnData => {
      localStorage.setItem('menus', JSON.stringify(returnData));
      this.menusDoc = returnData;
      this.menusUpdated.next([...returnData.menus]);
    });
  }

  updateMenus(menu: Menu, navUrl) {
    const customer = this.globals.getCustomer();
    this.http.put<{ message: string }>(BACKEND_URL + '/' + customer.id, menu).subscribe(response => {
      this.menusDoc = menu;
      localStorage.setItem('menus', JSON.stringify(this.menusDoc));
      this.menusUpdated.next([...this.menusDoc.menus]);
      if (navUrl !== null) {
        this.router.navigate([navUrl]);
      }
      this.openSnackBar(response.message);
    });
  }

  createMenu(menuName: string) {
    const localMenusData = JSON.parse(localStorage.getItem('menus'));
    const menuData = {
      menu_name: menuName.toLocaleLowerCase(),
      id: uuid(),
      published: false,
      parent_group: '',
      members: [],
      progress: 50
    };
    localMenusData.menus.push(menuData);
    this.updateMenus(localMenusData, '/menus/list');
  }

  deleteMenuItem(menuId) {
    // update nested menus object
    const localMenusData = JSON.parse(localStorage.getItem('menus'));
    const menusArr = [...localMenusData.menus];
    localMenusData.menus = menusArr.filter(obj => obj.id !== menuId);
    this.updateMenus(localMenusData, null);
  }

  getDishesOnMenu(arr) {
    const dishes = this.dishService.getDishesData();
    console.log(dishes);
    if (dishes === null) {
      return [];
    } else {
      console.log(dishes);
      const filteredDishes = [];
      arr.forEach(item => {
        dishes.forEach(dishItem => {
          if (dishItem._id === item) {
            filteredDishes.push(dishItem);
          }
        });
      });

      return filteredDishes;
    }
  }

  // TODO: update menu on server
  cloneMenu(menusDoc) {
    this.updateMenus(menusDoc, null);
  }

  openSnackBar(message) {
    this.messageSnackBar.open(message, '', {
      duration: 2000
    });
  }
}
