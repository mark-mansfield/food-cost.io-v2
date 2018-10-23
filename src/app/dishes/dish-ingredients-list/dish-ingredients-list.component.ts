import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Dish } from '../dish.model';

import { DishService } from '../dish.service';
import { DishIngredient } from '../dish-ingredient.model';

@Component({
  selector: 'app-dish-ingredients-list',
  templateUrl: './dish-ingredients-list.component.html',
  styleUrls: ['./dish-ingredients-list.component.css']
})
export class DishIngredientsListComponent implements OnInit {


  public dish: Dish;
  public ingredients;
  public ingredientsList = [];
  public isLoading = false;
  private ingredientName: string;
  public id: string;


  constructor(private service: DishService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.isLoading = true;
    this.id = this.route.snapshot.paramMap.get('_id');
    this.ingredientName = this.route.snapshot.paramMap.get('ingredient_name');

    if (this.id) {

      if (this.dish.name) {
        this.ingredients = this.dish.ingredients;
      } else {
        this.dish = this.service.getSavedDishData();
        this.ingredients = this.dish.ingredients;
      }
      console.log(this.dish);
      this.isLoading = false;
    } else {
      console.log('no id sent');
    }
  }

  onDeleteDishIngredient(ingredientName) {
    this.dish.ingredients = this.ingredients.filter(item => item.name !== ingredientName);
    this.service.updateDish(this.dish);
  }

}
