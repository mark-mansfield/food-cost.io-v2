import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Dish } from '../dish.model';

import { DishService } from '../dish.service';
import { DishIngredient } from '../dish-ingredient.model';

@Component({
  selector: 'app-dish-ingredients-edit',
  templateUrl: './dish-ingredients-edit.component.html',
  styleUrls: ['./dish-ingredients-edit.component.css']
})
export class DishIngredientsEditComponent implements OnInit {

  public dish: Dish;
  public ingredient: DishIngredient;
  public ingredientsList = [];
  public isLoading = false;
  private ingredientName: string;
  public id: string;
  public qty: string;
  constructor(private service: DishService, private route: ActivatedRoute) { }

  ngOnInit() {

    this.isLoading = true;
    this.id = this.route.snapshot.paramMap.get('_id');
    this.ingredientName = this.route.snapshot.paramMap.get('ingredient_name').toLocaleLowerCase();

    // because a manual page reload removes the body of the http request
    // if page reload , grab the data from local storage
    if (this.id) {
      // this.ingredientsList = this.service.getIngredientsList(this.id);
      // console.log(this.ingredientsList);
      // if (!this.ingredientsList) {
      //   this.dish = this.service.getSavedDishData();
      //   this.ingredientsList = JSON.parse(JSON.stringify(this.dish.ingredients));
      // }
      this.dish = this.service.getSavedDishData();
      this.ingredientsList = JSON.parse(JSON.stringify(this.dish.ingredients));
      this.ingredient = this.ingredientsList.find(item => item.name === this.ingredientName);
      this.isLoading = false;
    } else {
      console.log('no id sent');
    }

  }

  updateIngredient() {
    this.ingredientsList.forEach((item, index) => {
      if (item.name === this.ingredientName) {
        this.ingredientsList[index] = this.ingredient;
        console.log(this.ingredient);
      }
    });

    this.dish.ingredients = this.ingredientsList;
    this.service.updateDish(this.dish);
    console.log(this.dish);
  }

  qtyChange (qty) {
    this.ingredient.qty = qty;
  }

  sliderChange(slider) {
      // console.log(slider.value);
      const val = parseInt(slider.value, 0) / 100;
      this.ingredient.EP_weight = val.toString();
      const output = document.querySelector('#slider-value');
      output.innerHTML = slider.value   + ' %';
  }
}
