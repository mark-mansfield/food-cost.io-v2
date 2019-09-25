import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Dish } from './dish.model';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Globals } from '../globals';
import { MatSnackBar } from '@angular/material';
import { v4 as uuid } from 'uuid';
import { Ingredient } from '../ingredients/ingredient.model';
const BACKEND_URL = environment.apiUrl + 'dishes';

@Injectable({ providedIn: 'root' })
export class DishService {
  private dish: Dish[] = [];
  private dishes: Dish[] = [];
  ingredients = [];
  public dishesUpdated = new Subject<Dish[]>();
  public dishUpdated = new Subject<Dish>();
  public ingredientsData;
  constructor(
    private http: HttpClient,
    private router: Router,
    private globals: Globals,
    private messageSnackBar: MatSnackBar
  ) { }

  getDishesUpdateListener() {
    return this.dishesUpdated.asObservable();
  }

  getDishUpdateListener() {
    return this.dishUpdated.asObservable();
  }

  getDishes(index, postsPerPage) {
    const customer = this.globals.getCustomer();
    this.http.get<{ dishes: any[] }>(BACKEND_URL + '/' + customer.id).subscribe(returnedData => {
      this.dishes = returnedData.dishes.reverse();
      this.saveLocalDishesData(this.dishes);
      const tmpArr = this.paginate(index, postsPerPage);
      this.dishesUpdated.next([...tmpArr]);
    });
  }

  // consumed by other services
  getDishData() {
    const customer = this.globals.getCustomer();
    this.http
      .get<{ dishes: any }>(BACKEND_URL + '/' + customer.id)
      .pipe(
        map(postData => {
          return postData.dishes.map(dish => {
            return {
              customerId: customer.id,
              _id: dish._id,
              uuid: dish.uuid,
              name: dish.name,
              ingredients: dish.ingredients,
              retail_price: dish.retail_price,
              cost: dish.cost,
              margin: dish.margin,
              description: dish.description,
              recipe_method: dish.recipe_method,
              plating_guide: dish.plating_guide,
              progress: dish.progress
            };
          });
        })
      )
      .subscribe(transformedPosts => {
        this.dishesUpdated.next([...transformedPosts]);
        localStorage.setItem('dishes', JSON.stringify(transformedPosts));
      });
  }

  // crud
  getDish() {
    return this.loadLocalDishData();
  }

  // delete a dish
  deleteDish(obj) {
    const customer = this.globals.getCustomer();
    this.http.post<{ nModified: number }>(BACKEND_URL + '/' + customer.id + '/delete', obj).subscribe(returnedData => {
      if (returnedData.nModified > 0) {
        this.dishes = this.dishes.filter(dish => dish.uuid !== obj.uuid);
        this.dishesUpdated.next([...this.dishes]);
        this.saveLocalDishesData(this.dishes);
        this.openSnackBar('Dish deleted');
        this.router.navigate(['/dishes/list']);
        return;
      } else {
        this.openSnackBar('Dish Not deleted due to a technical error');
        console.log(
          // tslint:disable-next-line: max-line-length
          'could not find item in Database collection to update, check syntax, query params, and check document fields ,match the api query'
        );
      }

    });
  }

  // cloneDish(dish) {
  //   const customer = this.globals.getCustomer();
  //   const dishData = {
  //     customerId: customer.id,
  //     name: dish.name + '(copy)'.toLocaleLowerCase(),
  //     uuid: uuid(),
  //     ingredients: dish.ingredients,
  //     retail_price: dish.retail_price,
  //     cost: dish.cost,
  //     margin: dish.margin,
  //     description: dish.description,
  //     recipe_method: dish.recipe_method,
  //     plating_guide: dish.plating_guide,
  //     progress: dish.progress
  //   };

  //   this.http
  //     .post<{ message: string; dish: Dish }>('http://localhost:3000/api/dishes', dishData)
  //     .subscribe(returnedData => {
  //       console.log(returnedData.message);
  //       this.dishes.push(returnedData.dish);
  //       this.dishesUpdated.next([...this.dishes]); // inform UI
  //       this.router.navigate(['/dishes']);
  //     });
  // }

  makeUUID() {
    return uuid();
  }


  addDish(dish) {
    const customer = this.globals.getCustomer();
    dish.customerId = customer.id;
    this.http
      .post<{ nModified: number }>(BACKEND_URL + '/' + customer.id, dish)
      .subscribe(returnedData => {
        if (returnedData.nModified > 0) {
          this.openSnackBar('Dish Added');
          this.dishes.push(dish);
          this.dishesUpdated.next([...this.dishes]); // inform UI
          this.router.navigate(['/dishes/list']);
          this.openSnackBar('Dish Added');
          return;
        }
        this.openSnackBar('Dish Not added due to a technical error');
        console.log(
          // tslint:disable-next-line: max-line-length
          'could not find item in Database collection to update, check syntax, query params, and check document fields ,match the api query'
        );

      });
  }


  updateDishIngredients(dish) {
    const customer = this.globals.getCustomer();
    this.http.put<{ nModified: number }>(BACKEND_URL + '/' + customer.id + '/update', dish).subscribe(returnedData => {
      console.log(returnedData);
      if (returnedData.nModified > 0) {
        this.dishes.forEach((item, index) => {
          if (item.uuid === dish.uuid) {
            this.dishes[index] = dish;
          }
        });
        this.saveLocalDishData(dish);
        this.saveLocalDishesData(this.dishes);
        this.openSnackBar('Dish Updated');
        this.router.navigate(['dish/' + dish.uuid + '/ingredients']);
      } else {
        this.openSnackBar('Dish Not Updated due to a technical error');
        console.log(
          // tslint:disable-next-line: max-line-length
          'could not find item in Database collection to update, check syntax, query params, and check document fields ,match teh api query'
        );
      }

    });
  }


  updateDish(dish) {
    const customer = this.globals.getCustomer();
    this.http.put<{ nModified: number }>(BACKEND_URL + '/' + customer.id + '/update', dish).subscribe(returnedData => {
      console.log(returnedData);
      if (returnedData.nModified > 0) {
        this.dishes.forEach((item, index) => {
          if (item.uuid === dish.uuid) {
            this.dishes[index] = dish;
          }
        });
        console.log(this.dishes);
        this.saveLocalDishData(dish);
        this.saveLocalDishesData(this.dishes);
        this.openSnackBar('Dish Updated');
        console.log(this.dishes);
        this.router.navigate(['dish/' + dish.id]);
      } else {
        this.openSnackBar('Dish Not Updated due to a technical error');
        console.log(
          // tslint:disable-next-line: max-line-length
          'could not find item in Database collection to update, check syntax, query params, and check document fields ,match the api query');
      }
    });
  }

  getDishProgress(dish) {

    const ingredients = dish.ingredients;
    const ingredientCount = ingredients.length;
    let completed = 0;
    ingredients.forEach(item => {
      if (item.complete === true) {
        completed += 1;
      }
    });
    console.log(`Completed count : ${completed}`);
    this.setDishProgress(dish);
    return (completed / ingredientCount * 100).toFixed(0);
  }

  setDishProgress(dish: Dish): void {

    this.saveLocalDishData(dish);
  }
  // ** costing functions **

  // ingredient unit cost
  getIngredientUnitCost(id) {
    const localObject = this.loadLocalIngredientsData();
    let ingredient = localObject.ingredients.filter(item => item.id === id);
    ingredient = ingredient[0];
    return ingredient.unit_cost;
  }

  getIngredientCost(unit_price, qty) {
    return (unit_price * qty).toFixed(2);
    // return (parseFloat(unit_price) * parseFloat(qty)).toFixed(2);
  }

  // dish margin
  getMargin(dish: Dish) {
    const cost = dish.cost;
    const retail = dish.retail_price;
    const tax = 10;
    const markup = 100;
    const margin = (parseFloat(cost) / parseFloat(retail)) * (tax + markup);
    console.log(margin);
    return margin.toFixed(2);
  }

  // total
  getIngredientsTotal(dish) {
    const ingredients = dish.ingredients;
    const sum = ingredients.map(el => parseFloat(el.real_cost)).reduce(function (accumulator, currentValue) {
      return accumulator + currentValue;
    }, 0);
    return (sum);

  }

  // yeild / wastage
  getIngredientYield(ingredient) {
    const item_yeild = ingredient.EP_weight;
    console.log(item_yeild);
    if (item_yeild === 1) {
      return (item_yeild * 100).toFixed(2);
    } else {
      return ((1 - item_yeild) * 100).toFixed(2);
    }
  }

  // cost afeter wastage
  getIngredientRealCost(item) {

    if (item.yield === '0.00') {
      return item.cost;
    }
    // tslint:disable-next-line:one-line
    else {
      const factor = 100 / item.yield;

      // avoid NaN  the ingredient has not had weights or quantites saved;
      const realCost = (factor * parseFloat(item.cost)).toFixed(2);
      if (realCost === 'NaN') {
        return '0';
      }
      return realCost;
    }
  }

  // pagination
  paginate(index, pageCount) {
    const sliceStart = index * pageCount;
    const sliceLength = sliceStart + pageCount;
    return this.dishes.slice(sliceStart, sliceLength);
  }

  paginateOnChange(index, pageCount) {
    this.dishesUpdated.next([...this.paginate(index, pageCount)]);
  }

  // search for a dish by name
  searchDishByName(searchTerm) {
    const searchResults = this.dishes.filter(dish => dish.name.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()));
    this.dishesUpdated.next([...searchResults]);
  }



  showAllDishes() {
    const dishesData: any = this.getDishesData();
    this.dishesUpdated.next([...dishesData]);
  }

  loadLocalDishData() {
    return JSON.parse(localStorage.getItem('dish'));
  }

  loadLocalIngredientsData() {
    return JSON.parse(localStorage.getItem('ingredients'));
  }

  saveLocalDishData(dish: Dish) {
    localStorage.setItem('dish', JSON.stringify(dish));
  }

  saveLocalDishesData(dishes) {
    localStorage.setItem('dishes', JSON.stringify(dishes));
  }

  getDishesData() {
    return JSON.parse(localStorage.getItem('dishes'));
  }

  getIngredientsList(dishId) {
    const selectedDish = this.getDish();
    return selectedDish.ingredients;
  }

  openSnackBar(message) {
    this.messageSnackBar.open(message, null, {
      verticalPosition: 'bottom',
      horizontalPosition: 'left',
      panelClass: 'fadeIn',
      duration: 3000
    });
  }
}
