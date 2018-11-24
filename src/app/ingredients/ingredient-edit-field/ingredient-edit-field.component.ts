import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IngredientsService } from '../ingredients.service';
import { Ingredient } from '../ingredient.model';

@Component({
  selector: 'app-ingredient-edit-field',
  templateUrl: './ingredient-edit-field.component.html',
  styleUrls: ['./ingredient-edit-field.component.css']
})
export class IngredientEditFieldComponent implements OnInit {
  public ingredient: Ingredient;
  public ingredientsList = [];
  public ingredientsDoc;

  public field_value: string;
  private field: string;
  public objIndex: number;
  public field_type: string;

  constructor(
    private route: ActivatedRoute,
    private service: IngredientsService
  ) {}

  ngOnInit() {
    this.field = this.route.snapshot.paramMap.get('field_name');
    this.field_type = this.route.snapshot.paramMap.get('field_type');
    if (this.field) {
      this.ingredient = this.service.loadLocalIngredientData();
      this.ingredientsDoc = this.service.loadLocalIngredientsData();
      this.ingredientsList = this.ingredientsDoc.ingredients;
      this.field_value = this.ingredient[this.field];
      this.objIndex = this.ingredientsList.findIndex(
        item => item[this.field] === this.field_value
      );
    } else {
      console.log('no field name sent');
    }
  }

  onUpdateItem() {
    this.ingredient = this.ingredientsList[this.objIndex];
    this.ingredientsList[this.objIndex][this.field] = this.field_value;
    this.ingredientsDoc.ingredients = this.ingredientsList;
    console.log(this.ingredient);
    this.service.updateIngredient(this.ingredient, this.ingredientsDoc);
  }
}
