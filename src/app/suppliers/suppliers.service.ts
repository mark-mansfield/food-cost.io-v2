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
  public suppliersDoc;
  public suppliersUpdated = new Subject<Supplier[]>();

  constructor(
    private http: HttpClient,
    private router: Router,
    public globals: Globals,
    private messageSnackBar: MatSnackBar
  ) {}

  getSuppliersUpdateListener() {
    return this.suppliersUpdated.asObservable();
  }

  getUuid() {
    return uuid();
  }

  openSnackBar(message) {
    this.messageSnackBar.open(message, '', {
      duration: 2000
    });
  }

  // list objects
  getSuppliers() {
    const customer = this.globals.getCustomer();
    this.http.get<{ suppliers: any[] }>(BACKEND_URL + '/' + customer.id).subscribe(returnData => {
      localStorage.setItem('suppliers', JSON.stringify(returnData));
      this.suppliersDoc = returnData;
      this.suppliersUpdated.next([...returnData.suppliers]);
    });
  }

  // create object
  createSupplier(supplier: Supplier) {
    const localSuppliersData = JSON.parse(localStorage.getItem('suppliers'));
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
    localSuppliersData.suppliers.push(object);
    this.updateSuppliers(localSuppliersData, '/suppliers/list');
  }

  // update object
  updateSuppliers(supplier: Supplier, navUrl) {
    const customer = this.globals.getCustomer();
    this.http.put<{ message: string }>(BACKEND_URL + '/' + customer.id, supplier).subscribe(response => {
      this.suppliersDoc = supplier;
      localStorage.setItem('suppliers', JSON.stringify(this.suppliersDoc));
      this.suppliersUpdated.next([...this.suppliersDoc.suppliers]);
      if (navUrl !== null) {
        this.router.navigate([navUrl]);
      }
      this.openSnackBar(response.message);
    });
  }

  // delete object
  deleteSupplier(id) {
    // update nested menus object
    const localSuppliersData = JSON.parse(localStorage.getItem('suppliers'));
    const supplierArr = [...localSuppliersData.suppliers];
    localSuppliersData.suppliers = supplierArr.filter(obj => obj.id !== id);
    this.updateSuppliers(localSuppliersData, null);
  }
}
