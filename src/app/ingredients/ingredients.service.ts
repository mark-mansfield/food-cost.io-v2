import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Ingredient } from './ingredient.model';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { Globals } from '../globals';
import { v4 as uuid } from 'uuid';
const BACKEND_URL = environment.apiUrl + 'ingredients';

@Injectable({ providedIn: 'root' })
export class IngredientsService {
  public ingredient: Ingredient;
  public ingredientsList: any = [];
  public ingredientsDoc;

  public ingredientsUpdated = new Subject<Ingredient[]>();
  public ingredientImportDataUpdated = new Subject<Ingredient[]>();
  public mode = 'edit';

  importObject = {
    cleanColsArr: [],
    importDataStructure: [],
    cleanedData: []
  };

  constructor(private http: HttpClient, private router: Router, public globals: Globals) {}

  getIngredientsUpdateListener() {
    return this.ingredientsUpdated.asObservable();
  }

  getIngredientsImportDataUpdateListener() {
    return this.ingredientImportDataUpdated.asObservable();
  }

  getSuppliers() {
    const ingredientsData = this.loadLocalIngredientsData();
    return ingredientsData.suppliers;
  }

  getUnitTypes() {
    const ingredientsData = this.loadLocalIngredientsData();
    return ingredientsData.unit_types;
  }
  // ingredients list - ALL
  getIngredients() {
    const customer = this.globals.getCustomer();
    this.http.get<{ ingredients: any[] }>(BACKEND_URL + '/' + customer.id).subscribe(returnData => {
      // prevent too many round trips to the server
      console.log(returnData);
      this.saveLocalIngredientsData(returnData);
      this.ingredientsDoc = returnData;
      this.ingredientsUpdated.next([...this.ingredientsDoc.ingredients]);
    });
  }

  createIngredient(
    ingredient_name: string,
    ingredient_price: string,
    unit_amount: string,
    purchase_amount: string,
    unit_type: string,
    supplier: string,
    category: string,
    sub_category: string
  ) {
    const customer = this.globals.getCustomer();
    this.ingredientsDoc = this.loadLocalIngredientsData();
    const obj: Ingredient = {
      id: uuid(),
      hash_key: ingredient_name.toLowerCase() + '**' + supplier,
      ingredient_name: ingredient_name.toLowerCase(),
      ingredient_price: ingredient_price,
      unit_amount: unit_amount,
      purchase_amount: purchase_amount,
      unit_type: unit_type,
      supplier: supplier,
      category: category,
      sub_category: sub_category
    };
    this.ingredientsDoc.ingredients.push(obj);
    this.updateIngredient(obj, this.ingredientsDoc);
  }

  removeDuplicateIngredients(arr) {
    const seenIngredients = Object.create(null);
    const deDupedIngredients = arr.filter((item, index) => {
      const key = item.ingredient_name + '**' + item.supplier;
      // if we have seen it before omit
      if (seenIngredients[key]) {
        return false;
      }
      // otherwise we havent see it before and now we flag it
      seenIngredients[key] = true;
      console.log('ingredient seen');
      return true;
    });
    return deDupedIngredients;
  }

  // hasDupes check if the current inport dat ahas an item
  //  that already exists in the stsyem.
  hasDupes(arr) {
    const ingredientsDoc = this.loadLocalIngredientsData();
    const hashTable = this.buildHashTable(ingredientsDoc.ingredients);
    let found = false;
    arr.forEach((item, index) => {
      const foundIndex = hashTable.indexOf(item.hash_key);
      // ingredient exists , overwrite
      if (foundIndex !== -1) {
        found = true;
        return;
      }
    });
    return found;
  }

  // builds a hash table of current ingredients
  // take the hash key which is a combination of props ingredient_name + ** + supplier
  buildHashTable(arr) {
    const hashTable = [];
    arr.forEach(item => {
      hashTable.push(item.hash_key);
    });
    return hashTable;
  }

  // overwrite existing ingredients and add new
  overwriteAndAddNewIngredients(arr) {
    // all ingredients exisit on current list
    // some ingredients exist on current list
    // no ingredients exist on current list
    const ingredientsDoc = this.loadLocalIngredientsData();
    const hashTable = this.buildHashTable(ingredientsDoc.ingredients);
    arr.forEach((item, index) => {
      const foundIndex = hashTable.indexOf(item.hash_key);
      // ingredient exists , overwrite
      if (foundIndex !== -1) {
        ingredientsDoc.ingredients[foundIndex] = item;
      } else {
        // ingredient not found add new
        ingredientsDoc.ingredients.push(item);
      }
    });
    return ingredientsDoc;
  }

  importIngredients(ingredientsDoc) {
    const customer = this.globals.getCustomer();
    this.http.put<{ message: string }>(BACKEND_URL + '/' + customer.id, ingredientsDoc).subscribe(returnedData => {
      console.log('update status: ' + returnedData.message);
      this.saveLocalIngredientsData(ingredientsDoc);
      this.ingredientsUpdated.next([this.ingredientsList]); // inform UI
      this.router.navigate(['/ingredients/list/']);
    });
  }

  // update ingredients doc [ add ,edit, delete ]
  // this document is never deleted only the contents of it get changed
  updateIngredient(ingredient, ingredientsDoc) {
    const customer = this.globals.getCustomer();
    this.http.put<{ message: string }>(BACKEND_URL + '/' + customer.id, ingredientsDoc).subscribe(returnedData => {
      console.log('update status: ' + returnedData.message);
      if (this.mode === 'edit') {
        this.saveLocalIngredientData(ingredient);
      }
      this.saveLocalIngredientsData(ingredientsDoc);
      this.ingredientsUpdated.next([this.ingredientsList]); // inform UI
      this.router.navigate(['/ingredients/list/']);
    });
  }

  saveLocalIngredientsData(ingredients: any) {
    localStorage.setItem('ingredients', JSON.stringify(ingredients));
  }

  // so we can access a selected ingredient without going to the server again
  saveLocalIngredientData(ingredient: Ingredient) {
    localStorage.setItem('ingredient', JSON.stringify(ingredient));
  }

  loadLocalIngredientData() {
    return JSON.parse(localStorage.getItem('ingredient'));
  }

  loadLocalIngredientsData() {
    return JSON.parse(localStorage.getItem('ingredients'));
  }

  refreshingredientsList() {
    const localIngredients = this.loadLocalIngredientsData();
    this.ingredientsUpdated.next([...localIngredients.ingredients]);
  }

  // search for an ingredient by name
  searchIngredientByName(searchTerm) {
    const ingredientsList = this.loadLocalIngredientsData();
    const searchResults = ingredientsList.ingredients.filter(item =>
      item.ingredient_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    console.log(searchResults);
    this.ingredientsUpdated.next(searchResults);
  }

  // search by category
  searchIngredientByCategory(searchTerm) {
    this.ingredientsList = this.loadLocalIngredientsData();
    const searchResults = this.ingredientsList.ingredients.filter(item => item.category.includes(searchTerm));
    this.ingredientsUpdated.next([...searchResults]);
  }

  // search by supplier
  searchIngredientBySupplier(searchTerm) {
    this.ingredientsList = this.loadLocalIngredientsData();
    const searchResults = this.ingredientsList.ingredients.filter(item => item.supplier.includes(searchTerm));
    this.ingredientsUpdated.next([...searchResults]);
  }

  uploadFile(file: File) {
    const customer = this.globals.getCustomer();
    const formData = new FormData();
    // params (label that maps to the backend storage label, the file of type file, and the filename)
    formData.append('file', file, file.name);

    this.http
      .post<{ message: string; data: any }>(BACKEND_URL + '/' + customer.id + '/import', formData)
      .subscribe(returnedData => {
        console.log(returnedData);
        const data = returnedData.data;
        let colCount = Object.entries(data[0]).length;
        this.importObject.importDataStructure = this.buildImportDataStruct(Object.entries(data[0]).length);
        this.importObject.importDataStructure = this.pushColValue(data, colCount);

        // delete empty column
        // turn each array [csv column] into a string
        // edge case empty array  = empty column

        this.importObject.importDataStructure.forEach((item, index) => {
          if (this.importObject.importDataStructure[index].join('').length === 0) {
            this.importObject.importDataStructure.splice(index, 1);
          }
        });

        colCount = this.importObject.importDataStructure.length;

        const arrOfIndexes = this.scanImportForEmptyCells(colCount);
        // eg [2, 3, 7, 2, 3, 7, 2, 3, 7, 2, 3, 7]
        const emptyCellIndexObj = this.countItemFrequnecy(arrOfIndexes);
        // e.g. {2: 4, 3: 4, 7: 4}

        this.importObject.cleanColsArr = [...this.importObject.importDataStructure];

        // delete empty cells if a whole row is empty
        const emptyCellItems = Object.entries(emptyCellIndexObj);
        this.importObject.cleanedData = this.removeBlankRows(emptyCellItems, colCount);
        this.ingredientImportDataUpdated.next([...this.importObject.cleanedData]);
        this.importObject.importDataStructure = [];
        this.importObject.cleanedData = [];
        this.importObject.cleanColsArr = [];
      });
  }

  buildImportDataStruct(colCount) {
    const tmpArray = [];
    for (let i = 0; i < colCount; i++) {
      tmpArray.push([]);
    }
    return tmpArray;
  }

  pushColValue(data, colCount) {
    const dataObjLowercased = JSON.parse(JSON.stringify(data).toLowerCase());
    const tmpArray = [...this.importObject.importDataStructure];
    dataObjLowercased.forEach(item => {
      const row = Object.entries(item);
      for (let i = 0; i < colCount; i++) {
        tmpArray[i].push(row[i][1]);
      }
    });
    return tmpArray;
  }

  /**  scanImportForEmptyCells()
   * params: { columnCount : int }
   * loop over a 2d array by column(n) rows(n) and look look for empty row cell
   * A row cell is defined by its [col][rowIndex]
   * if [col][rowindex] === '' add rowIndex to tmp array
   * create an array of empty cell indexes
   */
  scanImportForEmptyCells(columnCount) {
    const rowCount = this.importObject.importDataStructure[0].length;
    const arr = [];
    for (let col = 0; col < columnCount; col++) {
      for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
        // look at cell if empty push its index into a tmpArray
        if (this.importObject.importDataStructure[col][rowIndex] === '') {
          arr.push(rowIndex);
        }
      }
    }
    return arr;
  }

  countItemFrequnecy(arr) {
    const tmpArr = arr.reduce(function(allItems, name) {
      if (name in allItems) {
        allItems[name]++;
      } else {
        allItems[name] = 1;
      }
      return allItems;
    }, {});
    return tmpArr;
  }

  removeBlankRows(arr, rowSize) {
    const tmpArr = [...this.importObject.cleanColsArr];
    arr.forEach(item => {
      if (item[1] === rowSize) {
        console.log('row ' + item[0] + ' is blank');
        for (let i = 0; i < this.importObject.importDataStructure.length; i++) {
          tmpArr[i] = tmpArr[i].filter(Boolean);
        }
      }
    });
    return tmpArr;
  }
}
