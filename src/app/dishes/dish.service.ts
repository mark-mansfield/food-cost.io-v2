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
      console.log(returnedData);
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

  cloneDish(dish) {
    const customer = this.globals.getCustomer();
    const dishData = {
      customerId: customer.id,
      name: dish.name + '(copy)'.toLocaleLowerCase(),
      uuid: uuid(),
      ingredients: dish.ingredients,
      retail_price: dish.retail_price,
      cost: dish.cost,
      margin: dish.margin,
      description: dish.description,
      recipe_method: dish.recipe_method,
      plating_guide: dish.plating_guide,
      progress: dish.progress
    };

    this.http
      .post<{ message: string; dish: Dish }>('http://localhost:3000/api/dishes', dishData)
      .subscribe(returnedData => {
        console.log(returnedData.message);
        this.dishes.push(returnedData.dish);
        this.dishesUpdated.next([...this.dishes]); // inform UI
        this.router.navigate(['/dishes']);
      });
  }

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
        this.router.navigate(['dish/' + dish.id + '/ingredients']);
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
        this.saveLocalDishData(dish);
        this.saveLocalDishesData(this.dishes);
        this.openSnackBar('Dish Updated');

      } else {
        this.openSnackBar('Dish Not Updated due to a technical error');
        console.log(
          // tslint:disable-next-line: max-line-length
          'could not find item in Database collection to update, check syntax, query params, and check document fields ,match the api query');
      }
    });
  }


  // ** costing functions **

  // ingredient unit cost
  getIngredientUnitCost(id) {
    // load local data
    const localObject = this.loadLocalIngredientsData();
    // find object in local data
    let ingredient = localObject.ingredients.filter(item => item.id === id);
    ingredient = ingredient[0];
    //  return property value
    const purchasePrice = (parseFloat(ingredient.purchase_amount) / parseFloat(ingredient.unit_amount)).toFixed(2);
    return purchasePrice;
  }

  // dish margin
  getMargin(cost, retail) {
    const tax = 10;
    const markup = 100;
    const margin = (cost / retail) * (tax + markup);
    console.log(margin);
    return margin.toFixed(2);
  }

  // FUNCTION getIngredientsTotal(dishIngredientsList)
  // params:
  // dishIngredientList: a list of ingredients that need to be totalled
  // id: the id of the dish

  // notes
  // loop through the ingredient list and call getAuctal cost and pass in each ingredient
  //  returns string ingredientsTotal
  getIngredientsTotal(dishIngredientsList) {
    const costsArr = [];
    if (this.ingredientsData === undefined) {
      this.ingredientsData = this.loadLocalIngredientsData();
    }
    dishIngredientsList.forEach(item => {
      costsArr.push(parseFloat(this.getIngredientActualCost(item)));
    });

    console.log(costsArr);
    return '0.00';
  }

  // FUNCTION: getIngredientActualCost(item)
  // params:
  // item: object {
  //     id = "asdasd-sdfsdfs-sdfsdfsd-sdfsdfsdf-',
  //     name: "sea salt",
  //     qty: "0",
  //     AP_weight: "0",
  //     cost: "[return val from a function]"
  //     EP_weight: "0"
  // }
  // returns a realCost as a string to 2 decimal places.
  getIngredientActualCost(item) {
    if (this.ingredientsData === undefined) {
      this.ingredientsData = this.loadLocalIngredientsData();
    }
    let currentIngredient = this.ingredientsData.ingredients.filter(ingredient => ingredient.id === item.id);
    currentIngredient = currentIngredient[0];
    const itemYield = (parseFloat(item.EP_weight) / parseFloat(item.AP_weight)) * 100;
    const factor = 100 / itemYield;
    const unitCost = (
      parseFloat(currentIngredient.purchase_amount) / parseFloat(currentIngredient.unit_amount)
    ).toFixed(2);
    const itemCost = (parseFloat(unitCost) * item.qty).toFixed(2);
    const realCost = (factor * parseFloat(itemCost)).toFixed(2);

    console.log('item being costed');
    console.log(item);
    console.log('localdata for item being costed');
    console.log(currentIngredient);
    console.log('item yield: ' + itemYield);
    console.log('item factor: ' + factor);
    console.log('unitCost: ' + unitCost);
    console.log('itemCost: ' + itemCost);
    console.log('realCost: ' + realCost);
    return realCost;
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
    const searchResults = this.dishes.filter(p => p.name.includes(searchTerm));
    this.dishesUpdated.next([...searchResults]);
  }

  searchDishByFirstletter(letter) {
    const searchResults = this.dishes.filter(p => p.name[0] === letter);
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
