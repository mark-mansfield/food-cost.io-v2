import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Ingredient } from './ingredient.model';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { Globals } from '../globals';
import { Location } from '@angular/common';

const BACKEND_URL = environment.apiUrl + 'ingredients';

@Injectable({providedIn: 'root'})

export class IngredientsService {

  ingredient: Ingredient;
  public ingredientsList: any = [];
  public ingredientsUpdated = new Subject<Ingredient[]>();
  public ingredientsDoc;



  constructor(private _location: Location, private http: HttpClient,  private router: Router, public globals: Globals) { }

  geIngredientsUpdateListener() {
    return this.ingredientsUpdated.asObservable();
  }


  // ingredients list - ALL
  getIngredients() {
    const customer = this.globals.getCustomer();
    this.http.get<{ingredients: any[] }>(BACKEND_URL + '/' + customer.id)
    .subscribe(transformedPosts => {
      // prevent too many round trips to the server
      this.saveLocalIngredientsData(transformedPosts);
      this.ingredientsDoc = transformedPosts.ingredients;
      this.ingredientsUpdated.next([...this.ingredientsDoc]);
    });
  }

  // delete a dish
  deleteIngredient(id: String) {
    this.http.delete(BACKEND_URL + '/' + id)
      .subscribe(result => {
        // filter returns all entries where the  condition === true and removes entries where the condition === false
        // const updateDishes = this.dishes.filter(dish => dish._id !== id);
        // // update menus array with filtered result
        // this.dishes = updateDishes;
        // // inform UI
        // this.dishesUpdated.next([...this.dishes]);
        console.log(result);

    });
  }

  updateIngredient(ingredient,  ingredientsDoc) {
    const customer = this.globals.getCustomer();
    this.http
    .put<{ message: string; }>(BACKEND_URL + '/' + customer.id, ingredientsDoc )
      .subscribe(returnedData => {
        console.log('update status: ' + returnedData.message);
        this.ingredientsList = ingredientsDoc.ingredients;
        this.saveLocalIngredientData(ingredient);
        this.saveLocalIngredientsData(this.ingredientsList);
        this.ingredientsUpdated.next([this.ingredientsList]); // inform UI
        this.router.navigate(['/ingredients/list/']);
    });
  }
  // ? so we can access a customers ingredients without going to the server
  saveLocalIngredientsData(ingredients: any) {
    localStorage.setItem('ingredients' , JSON.stringify(ingredients));
  }

  loadIngredientsList() {
    return JSON.parse(localStorage.getItem('ingredients'));
  }

  // so we can access a selected ingredient without going to the server again
  saveLocalIngredientData(ingredient: Ingredient) {
    localStorage.setItem('ingredient' , JSON.stringify(ingredient));
  }

  loadIngredientData() {
    return JSON.parse(localStorage.getItem('ingredient'));
  }
}
