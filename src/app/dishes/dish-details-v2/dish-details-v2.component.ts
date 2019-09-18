import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { Dish } from '../dish.model';
import { GlobalService } from '../../global.service';
import { DishService } from '../dish.service';
import { NumpadDialogComponent } from '../../dialogs/numpad-dialog/numpad-dialog.component';
// '../../suppliers/supplier-details/supplier-details.component.css'
// '../../css/list-layout.css'
@Component({
  selector: 'app-dish-details-v2',
  templateUrl: './dish-details-v2.component.html',
  styleUrls: ['./dish-details-v2.component.css']
})
export class DishDetailsV2Component implements OnInit, OnDestroy {


  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));

  referrerId = null;
  public dish: Dish;
  isDuplicate = false;
  submitButtonDisabled = true;
  invalidRetailPrice = false;
  showEditTools = false;
  showConfirmControls = false;
  createMode = false;
  iconBadgeText = '';
  supplierName = '';
  requiredText = 'This is required';
  optionalTextMsg = 'Optional';
  fieldValueGoodText = 'Looks Good';
  myForm: FormGroup;
  ingredients = [];
  ingredientsTotal: number;
  private routeSub: any;

  constructor(
    private fb: FormBuilder,
    private breakpointObserver: BreakpointObserver,
    private dishService: DishService,
    private globalService: GlobalService,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params.mode === 'edit') {
        if (params.showEditTools) {
          this.toggleEditMode();
        }

        // because our back button conditonally needs to link to our menus module sub component via menuId
        if (params.menuId) {
          this.referrerId = params.menuId;

        }
        this.myForm = this.initEditMode();
        this.iconBadgeText = this.globalService.getIconBadgeText(this.dish.name);
      }
      if (params.mode === 'create') {
        this.createMode = true;
        this.dish = {
          customerId: '',
          _id: null,
          name: '',
          uuid: this.dishService.makeUUID(),
          ingredients: [],
          retail_price: '0.00',
          cost: '0.00',
          margin: '0',
          description: 'not set',
          recipe_method: 'not set',
          plating_guide: 'not set',
          progress: 0

        };
        this.dishService.saveLocalDishData(this.dish);
        this.myForm = this.initCreateModeForm(this.dish);
      }
    });
  }

  initEditMode() {
    // when returning to this component in edit mode
    this.dish = JSON.parse(localStorage.getItem('dish'));

    this.dish.progress = parseInt(this.dishService.getDishProgress(this.dish), 10);
    this.dish.cost = this.dishService.getIngredientsTotal(this.dish);
    this.dish.margin = this.dishService.getMargin(this.dish);
    return this.fb.group({
      dishName: [this.dish.name, [Validators.required]],
      retail_price: [this.dish.retail_price, [Validators.required]],
      description: [this.dish.description],
      recipe_method: [this.dish.recipe_method],
      plating_guide: [this.dish.plating_guide],
      progress: [this.dishService.getDishProgress(this.dish)]
    });


  }

  initCreateModeForm(dish) {

    return this.fb.group({
      dishName: [null, [Validators.required]],
      retail_price: [this.dish.retail_price, [Validators.required]],
      description: [null],
      recipe_method: [null],
      plating_guide: [null],
      progress: [null]
    });
  }

  get f() {
    return this.myForm.controls;
  }

  get dishName() {
    return this.myForm.get('dishName');
  }

  get retail_price() {
    return this.myForm.get('retail_price');
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

      if (prop === 'retail_price') {
        // update unit cost if ingredient price gets changed to 0
        if (result === '0') {
          this.dish.retail_price = null;
          this.invalidRetailPrice = true;
          this.onUpdateDish('retail_price', null);
          this.dish.margin = result;
        } else {
          this.invalidRetailPrice = false;
          this.onUpdateDish('retail_price', result);

        }
      }
      // if (prop === 'unit_amount') {
      //   this.onUpdateIngredient('unitAmount', result);
      //   result === '0'
      //     ? (this.ingredient.unit_cost = +this.ingredient.ingredient_price)
      //     : (this.ingredient.unit_cost =
      //         parseFloat(this.myForm.controls.ingredientPrice.value) /
      //         parseFloat(this.myForm.controls.unitAmount.value));
      // }
    });
  }

  onToggleSubmitDisabled(evt) {
    this.submitButtonDisabled = !this.submitButtonDisabled;
  }

  onUpdateDish(prop, value) {
    console.log(value);
    // because some form control names are Camel Cased and object props are underscored if more than one word
    switch (prop) {
      case 'dishName':
        this.dish.name = value;
        break;
      case 'ingredients':
        this.dish.ingredients = value;
        break;
      case 'retail_price':
        this.dish.retail_price = value;
        this.dish.margin = this.dishService.getMargin(this.dish);
        break;
      case 'cost':
        this.dish.cost = value;
        break;
      case 'margin':
        this.dish.margin = value;
        break;
      case 'description':
        this.dish.description = value;
        break;
      case 'recipe_method':
        this.dish.recipe_method = value;
        break;
      case 'plating_guide':
        this.dish.plating_guide = value;
        break;
      case 'progress':
        this.dish.progress = value;
        break;
      default:
        break;
    }

    this.myForm.get(prop).setValue(value);
    this.myForm.status === 'VALID' ? (this.showConfirmControls = true) : (this.showConfirmControls = false);
    console.log(this.dish);
    // console.log(this.myForm);
  }

  onSubmitform() {
    console.log(this.createMode);
    if (this.createMode) {
      this.dishService.addDish(this.dish);
    } else {
      this.dishService.updateDish(this.dish);
    }
  }

  onRemoveDish() {

    this.dishService.deleteDish(this.dish);
  }

  toggleEditMode() {
    if (this.showEditTools) {
      this.showEditTools = false;
    } else {
      this.showEditTools = true;
    }
    console.log(this.showEditTools);
  }

  ngOnDestroy() { }
}
