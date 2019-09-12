import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';
import { Menu } from '../menus/menu.model';
import { Dish } from '../dishes/dish.model';
import { Ingredient } from '../ingredients/ingredient.model';
import { DishService } from '../dishes/dish.service';
import { IngredientsService } from '../ingredients/ingredients.service';
import { MenusService } from '../menus/menus.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit, OnDestroy {
  public customer: any;
  public menusSub: Subscription;
  public dishesSub: Subscription;
  public ingredientsSub: Subscription;
  public menus: Menu[] = [];
  public dishes: Dish[] = [];
  public ingredients: Ingredient[] = [];

  constructor(
    private authService: AuthService,
    public menuService: MenusService,
    public dishService: DishService,
    public ingredientsService: IngredientsService
  ) { }

  ngOnInit() {
    this.customer = this.authService.getAccountData();
    this.menuService.getMenusAndPaginate(0, 10);
    this.dishService.getDishData();
    this.ingredientsService.getIngredients();

    this.dishesSub = this.dishService.getDishesUpdateListener().subscribe((dishes: Dish[]) => {
      this.dishes = dishes;
      console.log(this.dishes);
    });

    this.menusSub = this.menuService.getMenusUpdateListener().subscribe((data: Menu[]) => {
      this.menus = data;
      console.log(this.menus);
    });

    this.ingredientsSub = this.ingredientsService.getIngredientsUpdateListener().subscribe((data: Ingredient[]) => {
      this.ingredients = data;
      // console.log(this.ingredients);
    });
  }

  // testOverwriteAndAddNewIngredients() {
  //   const dupedData = [
  //     {
  //       id: 'f7ad03f5-b8a1-4d50-a5ee-274834676fde',
  //       hash_key: 'sunflower kernels kg**two providores',
  //       ingredient_name: 'sunflower kernels kg',
  //       ingredient_price: '6.4',
  //       unit_amount: '',
  //       purchase_amount: '',
  //       unit_type: '',
  //       unit_cost: 0,
  //       supplier: 'two providores',
  //       category: 'drygoods',
  //       sub_category: ''
  //     },
  //     {
  //       id: 'f7ad03f5-b8a1-4d50-a5ee-274834676fde',
  //       hash_key: 'pumpkin seeds kg**two providores',
  //       ingredient_name: 'pumpkin seeds kg',
  //       ingredient_price: '5',
  //       unit_amount: '',
  //       purchase_amount: '',
  //       unit_type: '',
  //       unit_cost: 0,
  //       supplier: 'two providores',
  //       category: 'drygoods',
  //       sub_category: ''
  //     },
  //     {
  //       id: 'f7ad03f5-b8a1-4d50-a5ee-274834676fde',
  //       hash_key: 'sesame seeds kg**two providores',
  //       ingredient_name: 'sesame seeds kg',
  //       ingredient_price: '6.7',
  //       unit_amount: '',
  //       purchase_amount: '',
  //       unit_type: '',
  //       unit_cost: 0,
  //       supplier: 'two providores',
  //       category: 'drygoods',
  //       sub_category: ''
  //     }
  //   ];
  //   this.ingredientsService.overwriteAndAddNewIngredients(dupedData);
  // }

  ngOnDestroy() {
    this.menusSub.unsubscribe();
    this.dishesSub.unsubscribe();
    this.ingredientsSub.unsubscribe();
  }
}
