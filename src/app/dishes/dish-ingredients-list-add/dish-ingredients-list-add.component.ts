import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DishIngredient } from '../dish-ingredient.model';
import { Dish } from '../dish.model';
import { Ingredient } from 'src/app/ingredients/ingredient.model';
import { IngredientsService } from '../../ingredients/ingredients.service';
import { DishService } from '../dish.service';
import { MatAccordion } from '@angular/material/expansion';
@Component({
  selector: 'app-dish-ingredients-list-add',
  templateUrl: './dish-ingredients-list-add.component.html',
  styleUrls: ['./dish-ingredients-list-add.component.css']
})
export class DishIngredientsListAddComponent implements OnInit {
  public dish: Dish;
  public ingredientsList = [];
  public categories = [];
  public suppliers = ['xyz', '123', 'asd'];
  public ingredientIsOnList = true;
  public multi = false;
  public isLoading = false;
  public showRefresh = false;
  public category;
  public ingredientsSub: Subscription;
  public dishesSub: Subscription;
  public searchTerm: string;
  id: string;

  constructor(
    public ingredientsService: IngredientsService,
    public dishesService: DishService,
    private route: ActivatedRoute,
    public router: Router,
    public ingredientService: IngredientsService
  ) { }

  @ViewChild('accordion')
  accordion: MatAccordion;

  ngOnInit() {
    this.dish = this.dishesService.loadLocalDishData();
    const ingredientData = this.ingredientService.loadLocalIngredientsData();
    this.categories = ingredientData.categories;

    if (ingredientData) {
      this.ingredientsList = ingredientData.ingredients;
      this.isLoading = true;
      this.ingredientsSub = this.ingredientService
        .getIngredientsUpdateListener()
        .subscribe((ingredientList: Ingredient[]) => {
          this.ingredientsList = ingredientList;
          this.isLoading = false;
        });
    } else {
      this.ingredientService.getIngredients();
      this.isLoading = true;
      this.ingredientsSub = this.ingredientService
        .getIngredientsUpdateListener()
        .subscribe((ingredientList: Ingredient[]) => {
          console.log(ingredientList);
          this.ingredientsList = ingredientList;
          this.isLoading = false;
        });
    }
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
    this.accordion.closeAll();
  }

  filterByCat(cat) {
    this.ingredientsService.searchIngredientByCategory(cat);
  }
}
