import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
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
  dishCount: number;
  searchTerm: string;
  linkListValue: string;
  mode = 'list';
  showRefresh = false;
  isLoading = false;
  pageIndex = 0;
  postsPerPage = 3;
  private dishesSub: Subscription;

  constructor(
    public dishesService: DishService,
    private router: Router,
    public igredientsService: IngredientsService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.igredientsService.getIngredients();
    this.dishesService.getDishes(this.pageIndex, this.postsPerPage);
    this.dishesSub = this.dishesService
      .getDishesUpdateListener()
      .subscribe((dishes: Dish[]) => {
        this.dishCount = this.dishesService.dishCount;
        this.dishes = dishes;
        this.linksList = [];
        this.buildLinksList();
        this.isLoading = false;
      });
  }

  // links list
  buildLinksList() {
    console.log('building links list');
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

  ngOnDestroy() {
    this.dishesSub.unsubscribe();
  }
}
