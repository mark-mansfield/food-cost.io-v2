import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuppliersService } from '../suppliers.service';
import { Supplier } from '../supplier.model';

@Component({
  selector: 'app-supplier-create',
  templateUrl: './supplier-create.component.html',
  styleUrls: ['./supplier-create.component.css']
})
export class SupplierCreateComponent implements OnInit {
  myForm: FormGroup;
  supplier: Supplier;

  submitButtonDisabled = true;
  isLoading = false;
  constructor(private service: SuppliersService, private fb: FormBuilder) {}

  ngOnInit() {
    this.isLoading = true;
    this.myForm = this.fb.group({
      supplierName: ['', [Validators.required]],
      contactName: ['', [Validators.required]],
      contactNumber: ['', [Validators.pattern('[0-9]*'), Validators.minLength(10), Validators.maxLength(10)]],
      email: ['', [Validators.required, Validators.email]],
      website: [''],
      agree: [false]
    });
    this.isLoading = false;
  }

  get supplierName() {
    return this.myForm.get('supplierName');
  }

  get contactName() {
    return this.myForm.get('contactName');
  }
  get contactNumber() {
    return this.myForm.get('contactNumber');
  }

  get email() {
    return this.myForm.get('email');
  }

  get agree() {
    return this.myForm.get('agree');
  }

  checkFormStatus() {
    console.log(this.myForm.status);
  }

  toggleSubmitDisabled() {
    if (this.submitButtonDisabled) {
      this.submitButtonDisabled = false;
    } else {
      this.submitButtonDisabled = true;
    }
  }
  onSubmitForm() {
    this.supplier = {
      supplier_name: this.myForm.get('supplierName').value,
      contact_name: this.myForm.get('contactName').value,
      contact_email: this.myForm.get('email').value,
      id: this.service.getUuid(),
      contact_number: this.myForm.get('contactNumber').value,
      website: this.myForm.get('website').value,
      products: [],
      ingredient_cat: ''
    };
    this.service.createSupplier(this.supplier);
  }
}
