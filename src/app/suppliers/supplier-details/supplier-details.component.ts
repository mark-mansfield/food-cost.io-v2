import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
// import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { SuppliersService } from '../suppliers.service';
import { GlobalService } from '../../global.service';
import { Supplier } from '../supplier.model';

/** Error when invalid control is dirty, touched, or submitted. */
// export class MyErrorStateMatcher implements ErrorStateMatcher {
//   isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
//     const isSubmitted = form && form.submitted;
//     return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
//   }
// }

@Component({
  selector: 'app-supplier-details',
  templateUrl: './supplier-details.component.html',
  styleUrls: ['./supplier-details.component.css']
})
export class SupplierDetailsComponent implements OnInit {
  isLoading = false;
  showEditTools = false;
  showInputs = false;
  show_contact_name_input = false;
  show_contact_number_input = false;
  show_email_address_input = false;
  show_ingredient_category_input = false;
  show_website_input = false;
  showConfirmControls = false;
  // showFormButtons = false;
  showDetails = false;

  supplier: Supplier;
  myForm: FormGroup;

  // nameFormControl = new FormControl('', [Validators.required]);
  // agree = new FormControl('', [Validators.requiredTrue]);
  // matcher = new MyErrorStateMatcher();
  selectedId;
  iconBadgeText = '';

  constructor(
    private supplierService: SuppliersService,
    private fb: FormBuilder,
    private globalService: GlobalService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.selectedId = paramMap.get('id');
        this.supplier = JSON.parse(localStorage.getItem('supplier'));

        this.myForm = this.fb.group({
          contactName: [this.supplier.contact_name, [Validators.required]],
          contactNumber: [this.supplier.contact_number, [Validators.required]],
          email: [this.supplier.contact_email, [Validators.required, Validators.email]],
          website: [this.supplier.website],
          ingredientCat: [this.supplier.ingredient_cat],
          agree: [false, [Validators.requiredTrue]]
        });

        this.iconBadgeText = this.globalService.getIconBadgeText(this.supplier.supplier_name);
        this.isLoading = false;
      }
    });
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

  get website() {
    return this.myForm.get('website');
  }

  get ingredientCat() {
    return this.myForm.get('ingredientCat');
  }

  showDeleteAlert() {
    alert('Deleting this supplier will delete all their ingredients also');
  }

  toggleEditMode() {
    if (this.showEditTools) {
      this.showEditTools = false;
    } else {
      this.showEditTools = true;
    }
  }

  toggleInputVisibility(input) {
    if (!this[input]) {
      this[input] = true;
    } else {
      this[input] = false;
    }
  }

  onSubmitform() {
    console.log(this.supplier);
  }

  onUpdateSupplier(prop, value) {
    this.supplier[prop] = value;
  }
}
