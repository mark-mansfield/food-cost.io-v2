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
  public noSearcResultsFound = new Subject<boolean>();
  public noMenusFound = new Subject<boolean>();
  constructor(
    private http: HttpClient,
    private router: Router,
    public globals: Globals,
    private dishService: DishService,
    private messageSnackBar: MatSnackBar
  ) { }

  getMenusUpdateListener() {
    return this.menusUpdated.asObservable();
  }

  dishesOnMenuUpdateListener() {
    return this.dishesOnMenuUpdated.asObservable();
  }


  getNoSearchResultsUpdatedListener() {
    return this.noSearcResultsFound.asObservable();
  }

  getNoMenusUpdatedListener() {
    return this.noMenusFound.asObservable();
  }

  // pagination
  paginate(index, pageCount) {
    const sliceStart = index * pageCount;
    const sliceLength = sliceStart + pageCount;
    return this.menusDoc.menus.slice(sliceStart, sliceLength);
  }

  getUuid() {
    return uuid();
  }
  // Menus list - ALL
  getMenusAndPaginate(index, postsPerPage) {
    const customer = this.globals.getCustomer();
    this.http.get<{ menus: any[] }>(BACKEND_URL + '/' + customer.id).subscribe(returnData => {
      this.saveLocalMenusData(returnData);
      if (returnData.menus.length > 0) {
        this.menusDoc = returnData;
        const tmpArr = this.paginate(index, postsPerPage);
        this.menusUpdated.next([...returnData.menus]);
      } else {
        this.noMenusFound.next(true);
      }
    });
  }



  updateMenus(menu: Menu) {

    const customer = this.globals.getCustomer();
    this.http.put<{ message: string }>(BACKEND_URL + '/' + customer.id, menu).subscribe(response => {
      this.menusDoc = menu;
      this.saveLocalMenusData(this.menusDoc);
      this.menusUpdated.next([...this.menusDoc.menus]);
      this.openSnackBar(response.message);
    });
  }

  addMenu(menuName: string) {
    const customer = this.globals.getCustomer();
    this.menusDoc = JSON.parse(localStorage.getItem('menus'));
    const obj = {
      menu_name: menuName.toLocaleLowerCase(),
      id: uuid(),
      published: false,
      parent_group: '',
      members: [],
      progress: 50
    };
    this.http.post<{ nModified: number }>(BACKEND_URL + '/' + customer.id, obj)
      .subscribe(returnData => {
        if (returnData.nModified > 0) {
          this.menusDoc.menus.push(obj);
          this.saveLocalMenuData(obj);
          this.openSnackBar('Menu added');
          this.saveLocalMenusData(this.menusDoc);
          this.router.navigate(['/menus/list']);
        } else {
          this.openSnackBar('There was an error adding your menu');
          // tslint:disable-next-line:max-line-length
          console.log('could not find item in Database collection to update, check syntax, query params, and check document fields ,match the api query');
        }
      });


  }

  deleteMenu(obj) {
    const customer = this.globals.getCustomer();
    this.menusDoc = this.loadLocalMenusData();
    // using a POST REQUEST Because angular drops request body by default for DELETE requests
    // TODO set up a better workaround
    this.http.post<{ nModified: number }>(BACKEND_URL + '/' + customer.id + '/delete', obj)
      .subscribe(returnedData => {
        console.log(returnedData.nModified);
        if (returnedData.nModified > 0) {

          this.menusDoc = this.menusDoc.menus.filter(item => item.id !== obj.id);
          this.saveLocalMenusData(this.menusDoc);
          this.openSnackBar('Menu deleted!');
          this.router.navigate(['/menus/list']);

        } else {
          this.openSnackBar('Menu Not deleted due to a technical error');
          console.log(
            // tslint:disable-next-line: max-line-length
            'could not find item in Database collection to update, check syntax, query params, and check document fields ,match the api query'
          );
        }

      });
  }

  getDishesOnMenu(arr) {
    const dishes = this.dishService.getDishesData();
    if (dishes === null) {
      return [];
    } else {
      const filteredDishes = [];
      arr.forEach(item => {
        filteredDishes.push(dishes.find(element => element.uuid === item));
      });
      return filteredDishes;
    }
  }

  saveLocalMenusData(data) {
    localStorage.setItem('menus', JSON.stringify(data));
  }

  // so we can access a selected Menu without going to the server again
  saveLocalMenuData(data) {
    localStorage.setItem('menu', JSON.stringify(data));
  }

  loadLocalMenuData() {
    return JSON.parse(localStorage.getItem('menu'));
  }

  loadLocalMenusData() {
    return JSON.parse(localStorage.getItem('menus'));
  }


  searchMenuByName(searchTerm) {
    const menusList = this.loadLocalMenusData();
    const searchResults = menusList.menus.filter(item =>
      item.menu_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    console.log(searchResults.length);
    if (searchResults.length === 0) {
      this.noSearcResultsFound.next(true);
      this.menusUpdated.next(searchResults);
    } else {
      this.noSearcResultsFound.next(false);
      this.menusUpdated.next(searchResults);
    }

  }

  // TODO: update menu on server
  cloneMenu(menusDoc) {
    // this.updateMenus(menusDoc, null);
  }

  openSnackBar(message) {
    this.messageSnackBar.open(message, null, {
      verticalPosition: 'bottom',
      horizontalPosition: 'left',
      panelClass: 'fadeIn',
      duration: 3000
    });
  }
}
