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
  public dishCount: number;
  public ingredientsData;
  constructor(
    private http: HttpClient,
    private router: Router,
    private globals: Globals,
    private messageSnackBar: MatSnackBar
  ) {}

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
      this.dishCount = this.dishes.length;
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
  deleteDish(id: String) {
    this.http.delete(BACKEND_URL + '/' + id).subscribe(result => {
      this.dishes = this.dishes.filter(dish => dish._id !== id);
      this.dishCount = this.dishes.length;
      this.saveLocalDishesData(this.dishes);
      this.dishesUpdated.next([...this.dishes]);
    });
    this.router.navigate(['/dishes']);
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

  addDish(id: null, name: string /*, description: string, image: File*/) {
    const customer = this.globals.getCustomer();
    const dishData = {
      customerId: customer.id,
      name: name,
      uuid: uuid(),
      ingredients: [],
      retail_price: '0.00',
      cost: '0.00',
      margin: '0',
      description: 'not set',
      recipe_method: 'not set',
      plating_guide: 'not set',
      progress: 0
    };

    this.http
      .post<{ message: string; dish: Dish }>(BACKEND_URL + '/' + customer.id, dishData)
      .subscribe(returnedData => {
        console.log(returnedData.message);
        this.dishes.push(returnedData.dish);
        this.dishesUpdated.next([...this.dishes]); // inform UI
        this.router.navigate(['/dishes']);
      });
  }

  updateDish(dish: Dish, property: string) {
    this.http
      .put<{ message: string; dish: Dish }>('http://localhost:3000/api/dishes/' + dish._id, dish)
      .subscribe(returnedData => {
        const storedDishIndex = this.dishes.findIndex(p => p._id === dish._id);
        this.dishes[storedDishIndex] = returnedData.dish;
        this.saveLocalDishData(this.dishes[storedDishIndex]);
        this.saveLocalDishesData(this.dishes);
        this.dishesUpdated.next([...this.dishes]); // inform UI
        this.dishUpdated.next(this.dishes[storedDishIndex]); // inform UI
        // because updating a root level property should take us back to the start of the view stack
        // updating a nested array of objects should take us back to the second view in the view stack
        this.openSnackBar(returnedData.message);
        if (property === 'ingredients') {
          this.router.navigate(['/dish/' + dish._id + '/ingredients']);
        } else {
          this.router.navigate(['/dish/' + dish._id]);
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
    this.messageSnackBar.open(message, '', {
      duration: 2000
    });
  }
}
