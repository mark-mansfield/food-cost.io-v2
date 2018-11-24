import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { DishService } from '../dish.service';
import { Dish } from '../dish.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dish-details',
  templateUrl: './dish-details.component.html',
  styleUrls: ['./dish-details.component.css']
})
export class DishDetailsComponent implements OnInit {
  public isLoading = false;
  public dish: Dish;
  public dishSub: Subscription;

  public selectedId: string;
  ingredients = [];
  name: string;
  description: string;
  ingredientTotal: number;
  method: string;
  plating: string;
  cost: string;
  retail_price: string;
  margin: string;

  formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 2
  });

  constructor(private route: ActivatedRoute, private router: Router, private service: DishService) {}

  ngOnInit() {
    this.isLoading = true;
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('_id')) {
        this.selectedId = paramMap.get('_id');
        this.dish = this.service.getDish();
        console.log(this.dish);
        this.dishSub = this.service.getDishUpdateListener().subscribe((dish: Dish) => {
          this.dish = dish;
          this.setDishObjectData(dish);
        });
        this.setDishObjectData(this.dish);
        // this.getMargin(parseInt(this.cost, 0), parseInt(this.retail_price, 0));
        // TODO FIX the margin function to work correctly// these values are truthy / falsey so i reverse the comaprison for each
        // if (0 <= parseInt(this.cost, 0) &&  0 <= parseInt(this.retail_price, 0) ) {

        //   this.margin = this.getMargin(parseInt(this.cost, 0), parseInt(this.retail_price, 0));
        // }
        this.isLoading = false;
      } else {
        console.log('no id sent');
      }
    });
  }
  // {customerId: "5bbac8e83913a6394d42d8b2", _id: "5bd38dcbaa4adf145e2f86b1", name: "Burrito",…}
  setDishObjectData(dish) {
    this.name = dish.name;
    this.ingredients = this.dish.ingredients;
    this.ingredientTotal = this.ingredients.length;
    this.description = this.dish.description;
    this.method = this.dish.recipe_method;
    this.plating = this.dish.plating_guide;
    this.retail_price = this.dish.retail_price;
    this.cost = this.getIngredientsTotal().toFixed(2);
    this.margin = this.getMargin(this.cost, this.retail_price);
    // console.log(this.dish);
  }

  getMargin(cost, retail) {
    const tax = 10;
    const markup = 100;
    const margin = (cost / retail) * (tax + markup);
    console.log(margin);
    return margin.toFixed(2);
  }

  // searches an array of objects
  // {  name: "green kale", retail_price: "2.50", unit_amount: "3", unit_type: "bunch", supplier: "xyz", …}
  getIngredientsTotal() {
    const customerIngredients = this.service.loadLocalIngredientsData();
    const ingredientList = customerIngredients.ingredients;
    console.log(ingredientList);
    let total = 0.0;
    this.ingredients.forEach((dishIngredient, index) => {
      const searchVar = 'sunflower kernels kg';
      const item = ingredientList.find(function(obj) {
        return dishIngredient.name === obj.ingredient_name;
      });
      total += parseFloat(this.getActualCost(dishIngredient, item));
    });
    return total;
  }

  // get actual cost after wastage of an ingredient
  // ingredient object looks like this
  // {name: "sea salt", qty: "0", AP_weight: "0", EP_weight: "0"}
  getActualCost(dishIngredient, item) {
    const itemYield = (parseFloat(dishIngredient.EP_weight) / parseFloat(dishIngredient.AP_weight)) * 100;
    const factor = 100 / itemYield;
    const unitCost = item.ingredient_price / item.purchase_amount;
    const itemCost = unitCost * dishIngredient.qty;
    const realCost = factor * itemCost;
    return realCost.toFixed(2);
  }

  onDelete(id, index, pageCount) {
    this.isLoading = true;
    this.service.deleteDish(id);
    // this.service.paginate(index, pageCount);
  }
}
