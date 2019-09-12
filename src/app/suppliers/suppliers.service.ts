import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Supplier } from './supplier.model';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { Globals } from '../globals';
import { v4 as uuid } from 'uuid';
import { MatSnackBar } from '@angular/material';
const BACKEND_URL = environment.apiUrl + 'suppliers';

@Injectable({
  providedIn: 'root'
})



export class SuppliersService {
  public supplier: Supplier;
  public supplierList: any = [];
  public suppliersDoc: any;
  public suppliersUpdated = new Subject<Supplier[]>();
  public noSearcResultsFound = new Subject<boolean>();
  public noSuppliersFound = new Subject<boolean>();
  constructor(
    private http: HttpClient,
    private router: Router,
    public globals: Globals,
    private messageSnackBar: MatSnackBar
  ) { }

  getSuppliersUpdateListener() {
    return this.suppliersUpdated.asObservable();
  }


  getNoSearchResultsUpdatedListener() {
    return this.noSearcResultsFound.asObservable();
  }

  getNoSuppliersUpdatedListener() {
    return this.noSuppliersFound.asObservable();
  }

  getUuid() {
    return uuid();
  }


  // pagination
  paginate(index, pageCount) {
    const sliceStart = index * pageCount;
    const sliceLength = sliceStart + pageCount;
    return this.suppliersDoc.suppliers.slice(sliceStart, sliceLength);
  }

  paginateOnChange(index, pageCount) {
    const paginated = this.paginate(index, pageCount);
    console.log(paginated);
    this.suppliersUpdated.next([...paginated]);
  }


  // list objects
  getSuppliersAndPaginate(index, postsPerPage) {
    const customer = this.globals.getCustomer();
    this.http.get<{ suppliers: any[] }>(BACKEND_URL + '/' + customer.id).subscribe(returnData => {
      this.suppliersDoc = returnData;
      this.saveLocalSuppliersData(this.suppliersDoc);
      const tmpArr = this.paginate(index, postsPerPage);
      this.suppliersUpdated.next([...tmpArr]);
    });
  }

  getSuppliers() {
    const customer = this.globals.getCustomer();
    this.http.get<{ suppliers: any[] }>(BACKEND_URL + '/' + customer.id).subscribe(returnData => {
      this.suppliersDoc = returnData;
      this.saveLocalSuppliersData(this.suppliersDoc);
      this.suppliersUpdated.next([...this.suppliersDoc.suppliers]);
    });
  }

  // create object
  createSupplier(supplier: Supplier) {
    const suppliersDoc = this.loadLocalSuppliersData();
    const customer = this.globals.getCustomer();
    const object = {
      contact_name: supplier.contact_name,
      id: supplier.id,
      supplier_name: supplier.supplier_name.toLocaleLowerCase(),
      contact_number: supplier.contact_number,
      website: supplier.website,
      contact_email: supplier.contact_email,
      products: supplier.products,
      ingredient_cat: supplier.ingredient_cat
    };

    suppliersDoc.suppliers.push(object);
    this.http
      .post<{ nModified: number }>(BACKEND_URL + '/' + customer.id, object)
      .subscribe(returnData => {
        if (returnData.nModified > 0) {
          this.saveLocalSupplierData(object);
          this.saveLocalSuppliersData(suppliersDoc);
          this.openSnackBar('Supplier added!');
          this.suppliersUpdated.next([...suppliersDoc.suppliers]);
          this.router.navigate(['/suppliers/list'])
        } else {
          this.openSnackBar('Supplier Not Updated due to a technical error');
          console.log(
            // tslint:disable-next-line: max-line-length
            'could not find item in Database collection to update, check syntax, query params, and check document fields ,match teh api query'
          );
        }
      });

  }

  // update object
  updateSuppliers(supplier: Supplier) {
    console.log(supplier);
    const customer = this.globals.getCustomer();
    this.http.put<{ nModified: number }>(BACKEND_URL + '/' + customer.id, supplier).subscribe(response => {

      if (response.nModified > 0) {
        this.suppliersDoc.suppliers.forEach((item, index) => {
          if (item.id === supplier.id) {
            this.suppliersDoc[index] = supplier;
          }
        });

        this.saveLocalSupplierData(supplier);
        this.saveLocalSuppliersData(this.suppliersDoc);
        this.openSnackBar('Supplier updated!');
        this.suppliersUpdated.next([...this.suppliersDoc.suppliers]);

      } else {
        this.openSnackBar('Supplier Not Updated due to a technical error');
        console.log(
          // tslint:disable-next-line: max-line-length
          'could not find item in Database collection to update, check syntax, query params, and check document fields ,match teh api query'
        );
      }
    });
  }


  deleteSupplier(supplier) {
    const customer = this.globals.getCustomer();
    // using a POST REQUEST Because angular drops request body by default for DELETE requests
    // TODO set up a better workaround
    this.http.post<{ nModified: number }>(BACKEND_URL + '/' + customer.id + '/delete', supplier)
      .subscribe(returnedData => {
        console.log(returnedData.nModified);
        if (returnedData.nModified > 0) {

          this.suppliersDoc = this.suppliersDoc.suppliers.filter(item => item.id !== supplier.id);
          this.saveLocalSuppliersData(this.suppliersDoc);
          this.openSnackBar('Supplier deleted!');
          this.router.navigate(['/suppliers/list']);

        } else {
          this.openSnackBar('Supplier Not deleted due to a technical error');
          console.log(
            // tslint:disable-next-line: max-line-length
            'could not find item in Database collection to update, check syntax, query params, and check document fields ,match the api query'
          );
        }

      });
  }

  searchSupplierByName(searchTerm) {
    console.log(searchTerm);
    const list = this.loadLocalSuppliersData();
    const searchResults = list.suppliers.filter(item =>
      item.supplier_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    console.log(searchResults.length);
    if (searchResults.length === 0) {
      this.noSearcResultsFound.next(true);

    } else {
      this.noSearcResultsFound.next(false);
      this.suppliersUpdated.next(searchResults);
    }

  }

  loadLocalSupplierData() {
    return JSON.parse(localStorage.getItem('supplier'));
  }

  loadLocalSuppliersData() {
    return JSON.parse(localStorage.getItem('suppliers'));
  }

  saveLocalSupplierData(supplier: Supplier) {
    console.log(supplier)
    localStorage.setItem('supplier', JSON.stringify(supplier));
  }

  saveLocalSuppliersData(suppliers) {
    localStorage.setItem('suppliers', JSON.stringify(suppliers));
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


