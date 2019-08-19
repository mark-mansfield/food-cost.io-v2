import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GlobalService } from '../../global.service';
import { DishService } from '../dish.service';
import { Dish } from '../dish.model';
import { PageEvent } from '@angular/material/paginator';
import { IngredientsService } from '../../ingredients/ingredients.service';
@Component({
  selector: 'app-dishes-list',
  templateUrl: './dishes-list.component.html',
  styleUrls: ['./dishes-list.component.css']
})
export class DishesListComponent implements OnInit, OnDestroy {
  dishes: Dish[] = [];
  linksList = [];
  badgeNames = [];
  dishCount: number;
  searchTerm: string;
  linkListValue: string;
  mode = 'list';

  showRefresh = false;
  isLoading = false;
  showSearch = false;
  hasImage = false;
  pageIndex = 0;
  pageSizeOptions: number[] = [5, 10, 25];

  postsPerPage = 5;
  private dishesSub: Subscription;

  constructor(
    public globalService: GlobalService,
    public dishesService: DishService,
    private router: Router,
    public igredientsService: IngredientsService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.igredientsService.getIngredients();
    this.dishesService.getDishes(this.pageIndex, this.postsPerPage);
    this.dishesSub = this.dishesService.getDishesUpdateListener().subscribe((dishes: Dish[]) => {
      this.dishCount = this.dishesService.dishCount;
      this.dishes = dishes;
      this.dishes.forEach(item => {
        this.badgeNames.push(this.globalService.getIconBadgeText(item.name));
      });
      this.linksList = [];
      this.isLoading = false;
    });
  }

  getDishBadgeText(dishName) {
    return this.globalService.getIconBadgeText(dishName);
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

  ngOnDestroy() {
    this.dishesSub.unsubscribe();
  }
}
