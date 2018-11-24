import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Dish } from '../dish.model';
import { Subscription } from 'rxjs';
import { DishService } from '../dish.service';

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
  public id: string;

  public dishSub: Subscription;

  constructor(
    private service: DishService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.id = this.route.snapshot.paramMap.get('_id');
    this.dish = this.service.getDish();
    this.dishSub = this.service
      .getDishUpdateListener()
      .subscribe((dish: Dish) => {
        this.dish = dish;
        this.ingredients = this.dish.ingredients;
      });

    if (this.dish) {
      this.ingredients = this.dish.ingredients;
      this.isLoading = false;
    } else {
      console.log('no dish data on local');
    }
  }

  onDeleteDishIngredient(ingredientName) {
    this.dish.ingredients = this.ingredients.filter(
      item => item.name !== ingredientName
    );
    this.service.updateDish(this.dish, 'ingredients');
  }
}
