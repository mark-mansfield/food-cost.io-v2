import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { NumpadDialogComponent } from '../../dialogs/numpad-dialog/numpad-dialog.component';
import { Supplier } from '../../suppliers/supplier.model';
import { Ingredient } from '../ingredient.model';
import { GlobalService } from '../../global.service';
import { IngredientsService } from '../ingredients.service';
import { SuppliersService } from '../../suppliers/suppliers.service';

@Component({
  selector: 'app-ingredient-details-v2',
  templateUrl: './ingredient-details-v2.component.html',

  styleUrls: ['../../suppliers/supplier-details/supplier-details.component.css']
})
export class IngredientDetailsV2Component implements OnInit, OnDestroy {
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));

  categories = ['drygoods', 'produce', 'meat', 'seafood', 'poultry'];
  sub_categories = [
    'herbs',
    'mushrooms',
    'root veg',
    'fruit',
    'fungus',
    'sasoning',
    'spices',
    'oils',
    'cleaning products',
    'cooking aids',
    'grains and rice',
    'nuts or seeds',
    'sauces',
    'mayonaise',
    'flours',
    'dried goods'
  ];

  unit_types = ['box', 'litre', 'kg', 'bunch', 'single item', 'gm'];
  isDuplicate = false;
  submitButtonDisabled = true;
  invalidIngredientPrice = false;
  showEditTools = false;
  showConfirmControls = false;
  createMode = false;
  formMode = '';
  iconBadgeText = '';
  supplierName = '';
  requiredText = 'This is required';
  optionalTextMsg = 'Optional';
  fieldValueGoodText = 'Looks Good';
  ingredient: Ingredient;
  myForm: FormGroup;

  private suppliersSub: Subscription;
  public suppliers: Supplier[] = [];
  private routeSub: any;

  constructor(
    private fb: FormBuilder,
    private breakpointObserver: BreakpointObserver,
    private ingredientService: IngredientsService,
    private supplierService: SuppliersService,
    private globalService: GlobalService,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.supplierService.getSuppliers();
      if (params.mode === 'edit') {
        this.ingredient = JSON.parse(localStorage.getItem('ingredient'));
        this.supplierName = this.ingredient.supplier;
        this.myForm = this.fb.group({
          ingredientName: [this.ingredient.ingredient_name, [Validators.required]],
          ingredientPrice: [this.ingredient.ingredient_price, [Validators.required]],
          supplier: [null, [Validators.required]],
          category: [],
          subCategory: [],
          unitAmount: [this.ingredient.unit_amount, [Validators.required]],
          unitType: [null, [Validators.required]]
        });
        this.iconBadgeText = this.globalService.getIconBadgeText(this.ingredient.ingredient_name);
      }
      if (params.mode === 'create') {
        this.createMode = true;
        this.ingredient = {
          hash_key: '',
          id: '',
          ingredient_name: '',
          ingredient_price: '',
          unit_amount: '',
          purchase_amount: '',
          unit_type: '',
          unit_cost: 0,
          supplier: '',
          category: '',
          sub_category: ''
        };
        this.myForm = this.fb.group({
          ingredientName: [null, [Validators.required]],
          ingredientPrice: [null, [Validators.required, Validators.required]],
          supplier: [null, [Validators.required]],
          category: [],
          subCategory: [],
          unitAmount: [null, [Validators.required, Validators.pattern('[1-9][0-9]*')]],
          unitType: [null, [Validators.required]]
        });
      }
    });

    this.suppliersSub = this.supplierService.getSuppliersUpdateListener().subscribe((data: Supplier[]) => {
      this.suppliers = data;
      if (!this.createMode && data.length > 0) {
        this.initFormSelectsWithSelectedValues();
      }
    });
  }

  ngOnDestroy() {
    this.suppliersSub.unsubscribe();
  }

  initFormSelectsWithSelectedValues() {
    const selectedSupplierIndex = this.suppliers.findIndex(obj => obj.supplier_name === this.supplierName);
    const selectedCategoryIndex = this.categories.findIndex(element => element === this.ingredient.category);
    const selectedSubCategoryIndex = this.sub_categories.findIndex(element => element === this.ingredient.sub_category);
    const selectedUnitTypeIndex = this.unit_types.findIndex(element => element === this.ingredient.unit_type);
    this.myForm.get('supplier').setValue(this.suppliers[selectedSupplierIndex].supplier_name);
    this.myForm.get('category').setValue(this.categories[selectedCategoryIndex]);
    this.myForm.get('subCategory').setValue(this.sub_categories[selectedSubCategoryIndex]);
    this.myForm.get('unitType').setValue(this.unit_types[selectedUnitTypeIndex]);
  }

  toggleEditMode() {
    if (this.showEditTools) {
      this.showEditTools = false;
    } else {
      this.showEditTools = true;
    }
    console.log(this.showEditTools);
  }

  toggleInputVisibility(input) {
    if (!this[input]) {
      this[input] = true;
    } else {
      this[input] = false;
    }
  }

  onSubmitform() {
    console.log(this.createMode);
    if (this.createMode) {
      this.ingredientService.createIngredient(this.ingredient);
    } else {
      this.ingredientService.updateIngredientsDocumentV2(this.ingredient);
    }
  }

  // unique ingredient is defined by ingredient name and supplier
  // we cannot have duplicate ingredient names by the same supplier
  // we can have duplicate ingredient names by different suppliers
  // scan for duplicates when ingredient name and supplier are filled in before form is submitted
  scanForDuplicates() {
    const hashKey = this.ingredient.ingredient_name.toLowerCase() + '**' + this.supplier;
    const ingredientExists = this.ingredientService.ingredientExists(hashKey);

    if (ingredientExists !== -1 && this.ingredient.ingredient_name !== '') {
      this.isDuplicate = true;
      console.log('Ingredient exists already. Please specify a new name or a different supplier.');
    }
  }

  onUpdateIngredient(prop, value) {
    // because some formcontrol names are Camel Cased and object props are underscored if more than one word
    switch (prop) {
      case 'ingredientName':
        this.ingredient.ingredient_name = value;
        break;
      case 'ingredientPrice':
        this.ingredient.ingredient_price = value;
        break;
      case 'subCategory':
        this.ingredient.sub_category = value;
        break;
      case 'supplier':
        this.ingredient.supplier = value;
        this.scanForDuplicates();
        break;
      case 'unitAmount':
        this.ingredient.unit_amount = value;
        break;
      case 'unitType':
        this.ingredient.unit_type = value;
        break;
      default:
        this.ingredient[prop] = value;
        break;
    }

    this.myForm.get(prop).setValue(value);
    this.myForm.status === 'VALID' ? (this.showConfirmControls = true) : (this.showConfirmControls = false);
    console.log(this.ingredient);
    console.log(this.myForm);
  }

  onSelectUpdated(evt) {
    this.onUpdateIngredient(evt.source.id, evt.value);
  }

  onToggleSubmitDisabled(evt) {
    this.submitButtonDisabled = !this.submitButtonDisabled;
  }

  launchNumberPad(prop) {
    const dialogRef = this.dialog.open(NumpadDialogComponent, {
      width: '548px',
      height: '700px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === undefined) {
        return;
      }

      if (prop === 'ingredient_price') {
        // update unit cost if ingredient price gets changed to 0
        if (result === '0') {
          this.ingredient.unit_cost = null;
          this.invalidIngredientPrice = true;
          this.onUpdateIngredient('unitAmount', null);
        } else {
          this.invalidIngredientPrice = false;
        }

        this.onUpdateIngredient('ingredientPrice', result);
      }
      if (prop === 'unit_amount') {
        this.onUpdateIngredient('unitAmount', result);
        result === '0'
          ? (this.ingredient.unit_cost = +this.ingredient.ingredient_price)
          : (this.ingredient.unit_cost =
              parseFloat(this.myForm.controls.ingredientPrice.value) /
              parseFloat(this.myForm.controls.unitAmount.value));
      }
    });
  }

  onRemoveIngredient() {
    alert('Deleting this ingredient will delete it from all your dishes. IS that ok?');
  }

  get f() {
    return this.myForm.controls;
  }

  get ingredientName() {
    return this.myForm.get('ingredientName');
  }

  get ingredientPrice() {
    return this.myForm.get('ingredientPrice');
  }

  get unitAmount() {
    return this.myForm.get('unitAmount');
  }

  get unitType() {
    return this.myForm.get('unitType');
  }

  get supplier() {
    return this.myForm.get('supplier');
  }

  get category() {
    return this.myForm.get('category');
  }

  get subCategory() {
    return this.myForm.get('subCategory');
  }
}
