import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';

import { Menu } from '../menu.model';
import { Dish } from '../../dishes/dish.model';
import { GlobalService } from '../../global.service';
import { DishService } from '../../dishes/dish.service';
import { MenusService } from '../menus.service';


@Component({
  selector: 'app-menu-add-dish',
  templateUrl: './menu-add-dish.component.html',
  styleUrls: ['../menus-list/menus-list.component.css']
})
export class MenuAddDishComponent implements OnInit, OnDestroy {
  selectedId;
  dishes: Dish[] = [];
  dishesOnMenu: Dish[] = [];
  menu: Menu;
  badgeNames = [];
  dishCount: number;
  searchTerm: string;

  showRefresh = false;
  isLoading = false;
  searchFoundNothing = false;
  showSearch = false;
  pageIndex = 0;
  postsPerPage = 10;
  dishesSub: Subscription;

  constructor(
    public dishesService: DishService,
    public globalService: GlobalService,
    public menuService: MenusService,
    private router: Router,
    public snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.selectedId = paramMap.get('id');
        this.menu = JSON.parse(localStorage.getItem('menu'));
        this.dishesOnMenu = this.menuService.getDishesOnMenu(this.menu.members);
        this.dishesService.getDishes(this.pageIndex, this.postsPerPage);
      }
    });

    this.dishesSub = this.dishesService.getDishesUpdateListener().subscribe((dishes) => {
      this.dishCount = dishes.length;
      this.dishCount > 0 ? this.showSearch = true : this.showSearch = false;
      this.dishes = dishes;
      this.dishes.forEach(item => {
        this.badgeNames.push(this.globalService.getIconBadgeText(item.name));
      });
      this.isLoading = false;
    });
  }


  // refactor this
  // move the setting of local data into the service file


  onAddDishToMenu(dishId) {
    if (this.menu.members.includes(dishId)) {
      this.menuService.openSnackBar('item alread exists on this menu');
    } else {

      this.menu.members.push(dishId);

      localStorage.setItem('menu', JSON.stringify(this.menu));
      const localMenusData = JSON.parse(localStorage.getItem('menus'));
      const idx = localMenusData.menus.findIndex(obj => obj.id === this.menu.id);
      localMenusData.menus[idx] = this.menu;
      console.log(localMenusData);
      this.menuService.updateMenus(localMenusData);
      this.router.navigate(['menus/' + this.menu.id + '/details']);
    }
  }


  onChangedPage(pageData: PageEvent) {
    this.dishesService.paginateOnChange(pageData.pageIndex, pageData.pageSize);
  }

  saveDishToLocal(dish) {
    this.dishesService.saveLocalDishData(dish);
    this.router.navigate(['dish/edit']);
  }

  refreshDishesList() {
    this.pageIndex = 0;
    this.dishCount = this.dishesService.getDishesData().length;
    this.dishesService.paginateOnChange(this.pageIndex, this.postsPerPage);
    this.showRefresh = false;
  }

  search(searchValue) {

    if (searchValue) {
      this.dishesService.searchDishByName(searchValue);
      this.showRefresh = true;

    } else {
      alert('Please enter a serch term');
    }
  }



  ngOnDestroy() { }
}
