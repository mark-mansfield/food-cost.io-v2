import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DishService } from '../dish.service';
import { Dish } from '../dish.model';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-dishes-list',
  templateUrl: './dishes-list.component.html',
  styleUrls: ['./dishes-list.component.css']
})

export class DishesListComponent  implements OnInit, OnDestroy  {


  dishes: Dish[] = [];
  dishCount: number;
  linksList = [];
  isLoading = false;
  searchTerm: string;
  linkListValue: string;
  showRefresh = false;
  pageIndex = 0;
  postsPerPage = 3;
  private dishesSub: Subscription;

  constructor(public dishesService: DishService, private router: Router) {}

  ngOnInit() {
    this.isLoading = true;
    this.dishesService.getDishes(this.pageIndex, this.postsPerPage);
    this.dishCount = this.dishesService.getDishesData().length;
    this.dishesSub = this.dishesService.getDishUpdateListener()
      .subscribe((dishes: Dish[]) => {
        this.dishes = dishes;
        this.buildLinksList();
        this.isLoading = false;
    });
  }

  // links list
  buildLinksList() {
    if (this.linksList.length === 0) {
      const tmpArray = [];
      const localDishes: any  = this.dishesService.getDishesData();
      localDishes.forEach((item) => {
        tmpArray.push((item.name.substring(0, 1))
        .toLocaleLowerCase());
      });
      this.linksList = Array.from(new Set(tmpArray));
    }
  }

  onChangedPage(pageData: PageEvent) {
    this.dishesService.paginateOnChange(pageData.pageIndex, pageData.pageSize);
    console.log(pageData);
  }

  saveDishToLocal (id) {
    this.dishesService.saveDishData(this.dishesService.getDish(id));
    this.router.navigate(['dish/' + id]);
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
      this.dishCount = this.dishes.length;
      this.pageIndex = 0;
      this.dishesService.paginateOnChange(this.pageIndex, this.postsPerPage);
      this.showRefresh = true;
    } else {
      alert('Please enter a serch term');
    }
  }

  searchByFirstletter(firstLetter) {
    this.dishesService.searchDishByFirstletter(firstLetter);
    this.dishCount = this.dishes.length;
    this.showRefresh = true;
  }

  onDelete(id) {
    this.dishesService.deleteDish(id);

  }

  ngOnDestroy() {
    this.dishesSub.unsubscribe();
  }
}
