import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DishIngredient } from '../dish-ingredient.model';
import { Dish } from '../dish.model';
import { Ingredient } from 'src/app/ingredients/ingredient.model';
import { IngredientsService } from '../../ingredients/ingredients.service';
import { DishService } from '../dish.service';


@Component({
  selector: 'app-dish-ingredients-add',
  templateUrl: './dish-ingredients-add.component.html',
  styleUrls: ['../../css/list-layout.css']
})


export class DishIngredientsAddComponent implements OnInit, OnDestroy {
  public dish: Dish;
  public ingredientsList = [];
  public categories = [];
  public suppliers = [];

  public searchTerm: string;
  id: string;


  public ingredientIsOnList = true;
  public multi = false;
  public isLoading = false;
  public showRefresh = false;
  public showSearch = false;
  searchFoundNothing = false;
  public category;


  pageIndex = 0;
  pageSizeOptions: number[] = [5, 10, 25];
  postsPerPage = 5;

  public noSearchResultsSub: Subscription;
  public ingredientsSub: Subscription;


  constructor(
    public ingredientsService: IngredientsService,
    public dishesService: DishService,
    public ingredientService: IngredientsService
  ) { }


  ngOnInit() {
    this.isLoading = true;
    this.dish = this.dishesService.loadLocalDishData();
    const ingredientData = this.ingredientService.loadLocalIngredientsData();
    this.categories = ingredientData.categories;

    if (!ingredientData) {
      this.ingredientService.getIngredients();
    } else {
      this.ingredientsList = ingredientData.ingredients;
      // for user experience
      setTimeout(() => {
        this.isLoading = false;
      }, 2000);
    }




    this.ingredientsSub = this.ingredientService
      .getIngredientsUpdateListener()
      .subscribe((ingredientList: Ingredient[]) => {
        console.log(ingredientList);
        this.ingredientsList = ingredientList;

      });

    this.noSearchResultsSub = this.ingredientsService.getNoSearchResultsUpdatedListener().subscribe(result => {
      this.searchFoundNothing = result;
    });


  }

  onAddIngredient(object) {
    const ingredient: DishIngredient = {
      id: object.id,
      name: object.ingredient_name.toLocaleLowerCase(),
      qty: '',
      unit_price: '',
      AP_weight: '',
      EP_weight: '',
      yield: '',
      cost: '',
      real_cost: '',
      complete: false
    };
    // avoid expensive array object search
    const tpmStr = JSON.stringify(this.dish.ingredients);
    this.ingredientIsOnList = tpmStr.includes(object.ingredient_name);

    // because you should not be able to add the same inredient twice to a recipe
    if (this.ingredientIsOnList) {
      alert('this ingredient is already a part of this dish');
      return;
    }

    this.dish.ingredients.unshift(ingredient);
    this.dishesService.updateDishIngredients(this.dish);
  }


  search(searchValue) {
    if (searchValue) {
      this.ingredientService.searchIngredientByName(searchValue);
    }
  }

  refreshList() {
    this.ingredientsService.refreshingredientsList();
    this.showRefresh = false;

  }

  filterByCat(cat) {
    this.ingredientsService.searchIngredientByCategory(cat);
  }

  ngOnDestroy() {
    this.ingredientsSub.unsubscribe();
    this.noSearchResultsSub.unsubscribe();
  }
}
