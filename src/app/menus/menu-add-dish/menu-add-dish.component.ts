import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { DishService } from '../../dishes/dish.service';
import { MenusService } from '../menus.service';
import { Menu } from '../menu.model';
import { Dish } from '../../dishes/dish.model';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-menu-add-dish',
  templateUrl: './menu-add-dish.component.html',
  styleUrls: ['./menu-add-dish.component.css']
})
export class MenuAddDishComponent implements OnInit, OnDestroy {
  selectedId;
  dishes: Dish[] = [];
  dishesOnMenu: Dish[] = [];
  menu: Menu;
  linksList = [];
  dishCount: number;
  searchTerm: string;
  linkListValue: string;
  mode = 'list';
  showRefresh = false;
  isLoading = false;
  pageIndex = 0;
  postsPerPage = 10;
  dishesSub: Subscription;

  constructor(
    public dishesService: DishService,
    public menuService: MenusService,
    private router: Router,
    public snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.selectedId = paramMap.get('id');
        this.menu = JSON.parse(localStorage.getItem('menu'));

        this.dishesOnMenu = this.menuService.getDishesOnMenu(this.menu.members);
        this.dishesService.getDishes(this.pageIndex, this.postsPerPage);

        this.dishesSub = this.dishesService.getDishesUpdateListener().subscribe((dishes: Dish[]) => {
          this.dishCount = this.dishesService.dishCount;
          this.dishes = dishes;
          this.linksList = [];
          this.buildLinksList();
          this.isLoading = false;
          console.log(this.dishes);
        });
      }
    });
  }

  openSnackBar(message) {
    this.snackBar.open(message, '', {
      duration: 2000
    });
  }

  onAddDishToMenu(dishId) {
    if (this.menu.members.includes(dishId)) {
      this.openSnackBar('item alread exists on this menu');
    } else {
      this.menu.members.push(dishId);
      localStorage.setItem('menu', JSON.stringify(this.menu));
      const localMenusData = JSON.parse(localStorage.getItem('menus'));
      const idx = localMenusData.menus.findIndex(obj => obj.id === this.menu.id);
      localMenusData.menus[idx] = this.menu;
      this.menuService.updateMenus(localMenusData, '/menus/' + this.selectedId + '/details');
    }
  }

  // links list
  buildLinksList() {
    if (this.linksList.length === 0) {
      const tmpArray = [];
      this.linksList = [];
      const localDishes: any = this.dishesService.getDishesData();
      localDishes.sort().forEach(item => {
        tmpArray.push(item.name.substring(0, 1).toLocaleLowerCase());
      });
      this.linksList = Array.from(new Set(tmpArray));
      this.linksList.sort();
    }
  }

  onChangedPage(pageData: PageEvent) {
    this.dishesService.paginateOnChange(pageData.pageIndex, pageData.pageSize);
  }

  saveDishToLocal(dish) {
    this.dishesService.saveLocalDishData(dish);
    this.router.navigate(['dish/' + dish._id]);
  }

  refreshDishesList() {
    this.pageIndex = 0;
    this.dishCount = this.dishesService.getDishesData().length;
    this.dishesService.paginateOnChange(this.pageIndex, this.postsPerPage);
    this.showRefresh = false;
  }

  search(searchValue) {
    this.mode = 'search';
    if (searchValue) {
      this.dishesService.searchDishByName(searchValue);
      this.dishCount = this.dishes.length;
      this.showRefresh = true;
    } else {
      alert('Please enter a serch term');
    }
  }

  searchByFirstletter(firstLetter) {
    this.mode = 'search';
    this.dishesService.searchDishByFirstletter(firstLetter);
    this.dishCount = this.dishes.length;
    this.showRefresh = true;
  }

  ngOnDestroy() {}
}
