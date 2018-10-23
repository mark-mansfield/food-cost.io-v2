import { Component, OnInit} from '@angular/core';
import { DishService } from '../dish.service';
import { ActivatedRoute , Router} from '@angular/router';
import { Subscription } from 'rxjs';
import { DishIngredient } from '../dish-ingredient.model';
import { Dish } from '../dish.model';

@Component({
  selector: 'app-dish-ingredients-list-add',
  templateUrl: './dish-ingredients-list-add.component.html',
  styleUrls: ['./dish-ingredients-list-add.component.css']
})
export class DishIngredientsListAddComponent implements OnInit {


  public dish: Dish;
  public ingredient: DishIngredient;
  public ingredientsList = [];
  public isLoading = false;
  public ingredientName: string;
  id: string;

  constructor(public service: DishService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('_id');
    // because a manual page reload removes the body of the http request
    // if page reload , grab the data from local storage
    // ? Refactor this to just call local storage always?
    if (this.id) {
      // this.ingredientsList = this.service.getIngredientsList(this.id);
      // if (!this.ingredientsList) {
      //   this.dish = this.service.getSavedDishData();
      //   this.ingredientsList = JSON.parse(JSON.stringify(this.dish.ingredients));
      // }
      this.dish = this.service.getSavedDishData();
      console.log(this.dish);
      this.ingredientsList = JSON.parse(JSON.stringify(this.dish.ingredients));
      this.isLoading = false;
    } else {
      console.log('no id sent');
    }
  }

  onAddIngredient(name) {
    this.ingredientName = name;
    this.ingredient = {
      name: this.ingredientName.toLocaleLowerCase(),
      qty: '0',
      AP_weight : '0',
      EP_weight : '0'
    };
    console.log(this.dish);
    this.ingredientsList.unshift(this.ingredient);
    this.dish.ingredients = this.ingredientsList;

    this.service.updateDish(this.dish);
  }
}
