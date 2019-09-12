import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Ingredient } from './ingredient.model';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { MatSnackBar } from '@angular/material';
import { Globals } from '../globals';
import { v4 as uuid } from 'uuid';
const BACKEND_URL = environment.apiUrl + 'ingredients';

@Injectable({ providedIn: 'root' })
export class IngredientsService {
  public ingredient: Ingredient;
  public ingredientsList: any = [];
  public tmpArray: any = [];
  public ingredientsDoc;
  public ingredientCountUpdated = new Subject<number>();
  public ingredientsUpdated = new Subject<Ingredient[]>();
  public noSearcResultsFound = new Subject<boolean>();
  public ingredientImportDataUpdated = new Subject<Ingredient[]>();
  public mode = 'edit';

  importObject = {
    cleanColsArr: [],
    importDataStructure: [],
    cleanedData: []
  };

  constructor(
    private http: HttpClient,
    private router: Router,
    public globals: Globals,
    private messageSnackBar: MatSnackBar
  ) { }

  getIngredientsUpdateListener() {

    return this.ingredientsUpdated.asObservable();
  }

  getIngredientsCountUpdateListener() {
    return this.ingredientCountUpdated.asObservable();
  }

  getIngredientsImportDataUpdateListener() {
    return this.ingredientImportDataUpdated.asObservable();
  }

  getNoSearchResultsUpdatedListener() {
    return this.noSearcResultsFound.asObservable();
  }

  getSuppliers() {
    const ingredientsData = this.loadLocalIngredientsData();
    return ingredientsData.suppliers;
  }

  getUnitTypes() {
    const ingredientsData = this.loadLocalIngredientsData();
    return ingredientsData.unit_types;
  }

  // pagination
  paginate(index, pageCount) {
    const sliceStart = index * pageCount;
    const sliceLength = sliceStart + pageCount;
    return this.ingredientsDoc.ingredients.slice(sliceStart, sliceLength);
  }

  paginateOnChange(index, pageCount) {
    this.ingredientsUpdated.next([...this.paginate(index, pageCount)]);
  }



  // ingredients list - Paginated
  getIngredientsAndPaginate(index, postsPerPage) {

    const customer = this.globals.getCustomer();
    this.http.get<{ ingredients: any[] }>(BACKEND_URL + '/' + customer.id).subscribe(returnData => {
      // prevent too many round trips to the server
      console.log(returnData);
      this.saveLocalIngredientsData(returnData);
      this.ingredientsDoc = returnData;
      this.ingredientCountUpdated.next(this.ingredientsDoc.ingredients.length);
      const tmpArr = this.paginate(index, postsPerPage);
      this.ingredientsUpdated.next([...tmpArr]);
    });
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

  createIngredient(ingredient) {
    const {
      hash_key,
      id,
      ingredient_name,
      ingredient_price,
      unit_amount,
      purchase_amount,
      unit_type,
      unit_cost,
      supplier,
      category,
      sub_category
    } = ingredient;

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
      unit_cost: unit_cost,
      supplier: supplier,
      category: category,
      sub_category: sub_category
    };

    this.http
      .post<{ message: string; nModified: number }>(BACKEND_URL + '/' + customer.id + '/add', ingredient)
      .subscribe(returnedData => {
        console.log(returnedData);
        if (returnedData.nModified > 0) {
          this.openSnackBar('ingredient added');
          this.ingredientsDoc.ingredients.push(obj);
          this.saveLocalIngredientsData(this.ingredientsDoc);
        }

        if (returnedData.nModified === 0) {
          this.openSnackBar('there was an error locating your document');
          console.log(
            // tslint:disable-next-line: max-line-length
            'could not find item in Database collection to update, check syntax, query params, and check document fields ,match the api query'
          );
        }
      });

    // this.updateIngredientsDocumentV2(obj);
  }

  // update serer with single ingredient object

  updateIngredientsDocumentV2(ingredient) {
    const customer = this.globals.getCustomer();
    this.http
      .put<{ nModified: number }>(BACKEND_URL + '/' + customer.id + '/update', ingredient)
      .subscribe(returnedData => {
        console.log(returnedData);
        if (returnedData.nModified > 0) {
          this.openSnackBar('Ingredient Updated');
          return;
        }
        this.openSnackBar('Ingredient Not Updated due to a technical error');
        console.log(
          // tslint:disable-next-line: max-line-length
          'could not find item in Database collection to update, check syntax, query params, and check document fields ,match teh api query'
        );
      });
  }

  // returns 0 for an error, 1 for success
  updateLocalIngredientsDoc(ingredient) {
    const hashKey = ingredient.hash_key;
    const idx = this.ingredientExists(hashKey);
    if (idx === -1) {
      return 0;
    }
    const ingredientsDoc = this.loadLocalIngredientsData();
    ingredientsDoc[idx] = ingredient;
    this.saveLocalIngredientsData(ingredientsDoc);
    console.log(`saving local ingredients data ${ingredientsDoc}`);
    return 1;
  }

  ingredientExists(hashKey) {
    const ingredientsDoc = this.loadLocalIngredientsData();
    const searchResults = ingredientsDoc.ingredients.findIndex(item => item.hash_key === hashKey);
    return searchResults;
  }

  // removes duplicate records/ imports only uniqus
  removeDupeIngredientsThenImport(importData) {
    console.log(importData);
    // removeDupeIngredientsThenImport
    // this.importIngredients(ingredientsDoc);
  }

  removeDuplicateIngredients(importData) {
    const ingredientsDoc = this.loadLocalIngredientsData();
    // console.log(ingredientsDoc);

    // add both datas together
    const concat = ingredientsDoc.ingredients.concat(importData);
    console.log(concat);
    // create unique set
    const uniqueItems = Array.from(new Set(concat.map(a => a.hash_key))).map(hash_key => {
      return concat.find(a => a.hash_key === hash_key);
    });
    return uniqueItems;
  }

  // overwrite existing ingredients and add new
  overwriteAndAddNewIngredients(importData) {
    // edge cases
    // all ingredients exist on current list
    // some ingredients exist on current list
    // no ingredients exist on current list
    const ingredientsDoc = this.loadLocalIngredientsData();
    const hashTable = this.buildHashTable(ingredientsDoc.ingredients);
    importData.forEach((item, index) => {
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

  // hasDupes check if the current import data a has an item
  // that already exists in the stsyem.
  hasDupes(arr) {
    console.log(arr);
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

  importIngredients(ingredientsDoc) {
    const customer = this.globals.getCustomer();

    const ingredients = {
      ingredients: ingredientsDoc
    };
    console.log(ingredients);
    this.http
      .post<{ message: string }>(BACKEND_URL + '/' + customer.id + '/import', ingredients)
      .subscribe(returnedData => {
        console.log('update status: ' + returnedData.message);
        this.saveLocalIngredientsData(ingredientsDoc);

        this.router.navigate(['/ingredients/list/']);
      });
  }

  // update ingredients doc [ add ,edit, delete ]
  // this document is never deleted only the contents of it get changed
  updateIngredientsDocument(ingredient, ingredientsDoc) {
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
    console.log(searchResults.length);
    if (searchResults.length === 0) {
      this.noSearcResultsFound.next(true);
      this.ingredientsUpdated.next(searchResults);
    } else {
      this.noSearcResultsFound.next(false);
      this.ingredientsUpdated.next(searchResults);
    }

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
      .post<{ message: string; data: any }>(BACKEND_URL + '/' + customer.id + '/uploadCsvFile', formData)
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
        // eg { 0,0,0,0,0,0,0}
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

  //  scanImportForEmptyCells()
  //  * params: { columnCount : int }
  //  * loop over a 2d array by column(n) rows(n) and look look for empty row cells
  //  * A row cell is defined by its [col][rowIndex]
  //  * if [col][rowindex] === '' add rowIndex to tmp array
  //  * create an array of empty cell indexes

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
    const tmpArr = arr.reduce(function (allItems, name) {
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

  openSnackBar(message) {
    this.messageSnackBar.open(message, null, {
      verticalPosition: 'bottom',
      horizontalPosition: 'left',
      panelClass: 'fadeIn',
      duration: 3000
    });
  }
}
