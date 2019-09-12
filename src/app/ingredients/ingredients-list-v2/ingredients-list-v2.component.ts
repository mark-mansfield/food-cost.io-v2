import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IngredientsService } from '../ingredients.service';
import { PageEvent } from '@angular/material/paginator';
import { Ingredient } from '../ingredient.model';
import { GlobalService } from '../../global.service';

@Component({
  selector: 'app-ingredients-list-v2',
  templateUrl: './ingredients-list-v2.component.html',
  styleUrls: ['../../dishes/dishes-list/dishes-list.component.css']
})
export class IngredientsListV2Component implements OnInit, OnDestroy {
  public ingredients: Ingredient[] = [];
  badgeNames = [];
  public categories = [];
  public suppliers = [];
  public linksList = [];
  public searchTerm: string;
  public ingredientCount: number;
  isLoading = false;
  searchFoundNothing = false;
  showSearch = false;
  hasImage = false;
  postsPerPage = 10;
  pageIndex = 0;
  pageSizeOptions: number[] = [5, 10, 25];

  public ingredientsSub: Subscription;
  public ingredientsCounterSub: Subscription;
  public noSearchResultsSub: Subscription;
  constructor(public globalService: GlobalService, private service: IngredientsService, private router: Router) { }

  ngOnInit() {
    this.isLoading = true;
    this.service.getIngredientsAndPaginate(this.pageIndex, this.postsPerPage);
    this.ingredientsSub = this.service.getIngredientsUpdateListener().subscribe((data) => {
      console.log(data);
      this.ingredients = data;
      this.categories = this.service.ingredientsDoc.categories;
      this.suppliers = this.service.ingredientsDoc.suppliers;

      this.ingredients.forEach(item => {
        this.badgeNames.push(this.globalService.getIconBadgeText(item.supplier));
      });
      this.isLoading = false;
    });

    this.ingredientsCounterSub = this.service.getIngredientsCountUpdateListener().subscribe(data => {
      console.log(data);
      this.ingredientCount = data;
    });

    this.noSearchResultsSub = this.service.getNoSearchResultsUpdatedListener().subscribe(result => {
      this.searchFoundNothing = result;
    });
  }

  search(searchValue) {
    if (searchValue) {
      this.service.searchIngredientByName(searchValue);
    }
  }

  saveIngredientToLocal(ingredient) {
    this.service.saveLocalIngredientData(ingredient);
    this.router.navigate(['ingredient/edit']);
  }

  onChangedPage(pageData: PageEvent) {
    this.service.paginateOnChange(pageData.pageIndex, pageData.pageSize);
  }

  ngOnDestroy() {
    this.ingredientsSub.unsubscribe();
    this.ingredientsCounterSub.unsubscribe();
    this.noSearchResultsSub.unsubscribe();
  }
}
