import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { DishService } from '../dish.service';
import { Dish } from '../dish.model';
import { empty } from 'rxjs';
@Component({
  selector: 'app-dish-details',
  templateUrl: './dish-details.component.html',
  styleUrls: ['./dish-details.component.css']
})
export class DishDetailsComponent implements OnInit {

  public hasData = false;

  public dish: Dish;
  public selectedId: string;
  ingredients = [];

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


  constructor(private route: ActivatedRoute, private router: Router, private service: DishService) { }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('_id')) {
        this.selectedId = paramMap.get('_id');
        this.dish = this.service.getDish(this.selectedId );

        // because a manual page reload clears the request body
        const retrievedDish = Object.entries(this.dish);
        if (retrievedDish.length > 0) {
          this.hasData = true;
        } else {
          this.dish = JSON.parse(localStorage.getItem('dish'));
          if (this.dish === null) {
            this.router.navigate(['dishes/']);
          }
          this.hasData = true;
        }

        this.ingredients = this.dish.ingredients;
        this.ingredientTotal = this.ingredients.length;
        this.description = this.dish.description;
        this.method = this.dish.recipe_method;
        this.plating = this.dish.plating_guide;
        this.cost = this.dish.cost;
        this.retail_price = '0.10';
        this.getMargin(parseInt(this.cost, 0), parseInt(this.retail_price, 0));
        // TODO FIX the margin function to work correctly// these values are truthy / falsey so i reverse the comaprison for each
        // if (0 <= parseInt(this.cost, 0) &&  0 <= parseInt(this.retail_price, 0) ) {

        //   this.margin = this.getMargin(parseInt(this.cost, 0), parseInt(this.retail_price, 0));
        // }
        console.log(this.dish);

      } else {
        console.log('no id sent');
      }
    });
  }



  getMargin(cost, retail) {
   console.log(cost);
   console.log(retail);
    // const num = (0.05 / 0.1 ) * 110 ;
    // console.log(num);
    // return num.toFixed(2);
  }
}
