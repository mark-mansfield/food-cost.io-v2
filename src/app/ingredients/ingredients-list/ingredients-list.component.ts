import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IngredientsService } from '../ingredients.service';
import { Ingredient } from '../ingredient.model';
import { MatAccordion } from '@angular/material/expansion';

@Component({
  selector: 'app-ingredients-list',
  templateUrl: './ingredients-list.component.html',
  styleUrls: ['./ingredients-list.component.css']
})
export class IngredientsListComponent implements OnInit, OnDestroy {
  public isLoading = false;
  public showRefresh = false;
  public subscriptionActive = false;
  multi = true;
  public ingredients: Ingredient[] = [];
  public categories = [];
  public suppliers = [];
  public linksList = [];
  public ingredientCount: number;
  public selectedCat: string;
  public searchTerm: string;
  private ingredientsSub: Subscription;
  public ingredientData;
  public category;

  constructor(private service: IngredientsService, private router: Router) {}

  @ViewChild('accordion')
  accordion: MatAccordion;

  ngOnInit() {
    this.service.getIngredients();
    this.isLoading = true;
    this.ingredientsSub = this.service.getIngredientsUpdateListener().subscribe((data: Ingredient[]) => {
      console.log(data);
      this.subscriptionActive = true;
      this.ingredients = data;
      this.categories = this.service.ingredientsDoc.categories;
      this.suppliers = this.service.ingredientsDoc.suppliers;
      this.ingredientCount = this.ingredients.length;
      this.isLoading = false;
    });

    // const ingredientsDoc = this.service.loadLocalIngredientsData();
    // if (ingredientsDoc === null) {
    //   this.service.getIngredients();
    //   this.isLoading = true;
    //   this.ingredientsSub = this.service
    //     .getIngredientsUpdateListener()
    //     .subscribe((data: Ingredient[]) => {
    //       this.subscriptionActive = true;
    //       this.ingredients = data;
    //       this.categories = this.service.ingredientsDoc.categories;
    //       this.suppliers = this.service.ingredientsDoc.suppliers;
    //       this.ingredientCount = this.ingredients.length;
    //       this.isLoading = false;
    //     });
    // } else {
    //   this.ingredients = ingredientsDoc.ingredients;
    //   this.categories = ingredientsDoc.categories;
    //   this.suppliers = ingredientsDoc.suppliers;
    //   this.ingredientCount = this.ingredients.length;
    //   this.isLoading = false;
    // }
  }

  refreshList() {
    this.service.refreshingredientsList();
    this.showRefresh = false;
    this.accordion.closeAll();
  }

  // links list
  buildLinksList() {
    if (this.linksList.length === 0) {
      const tmpArray = [];
      this.ingredients.sort().forEach(item => {
        tmpArray.push(item.ingredient_name.substring(0, 1).toLocaleLowerCase());
      });
      this.linksList = Array.from(new Set(tmpArray));
      this.linksList.sort();
    }
  }

  search(searchValue) {
    if (searchValue) {
      this.service.searchIngredientByName(searchValue);
    }
  }

  filterByCat(cat) {
    console.log(cat);
    this.service.searchIngredientByCategory(cat);
  }

  filterBySupplier(supplier) {
    console.log(supplier);
    this.service.searchIngredientBySupplier(supplier);
  }

  refresh() {}

  searchByFirstletter(link) {
    console.log(link);
  }

  onDelete(index) {
    console.log(index);
    console.log(this.ingredients.slice(index, 1));
  }

  ngOnDestroy() {
    if (this.subscriptionActive) {
      this.ingredientsSub.unsubscribe();
    }
  }

  saveIngredientToLocal(ingredient) {
    this.service.saveLocalIngredientData(ingredient);
    this.router.navigate(['ingredients/' + ingredient.ingredient_name]);
  }
}
