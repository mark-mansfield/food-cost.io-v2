import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Dish } from '../dish.model';
import { DishIngredient } from '../dish-ingredient.model';
import { DishService } from '../dish.service';
import { NumpadDialogComponent } from '../../dialogs/numpad-dialog/numpad-dialog.component';

// custom  decimal validator
function validEpWeight(c: AbstractControl) {
  console.log(c.value > 0 && c.value <= 1);
  return c.value > 0 && c.value <= 1 ? null : { validEpWeight: { valid: true } };
}

// custom  quantity validator
function validQuantity(c: AbstractControl) {
  console.log(c.value > 0 && c.value <= 1);
  return c.value > 0 ? null : { validQuantity: { valid: true } };
}

@Component({
  selector: 'app-dish-ingredients-edit',
  templateUrl: './dish-ingredients-edit.component.html',
  styleUrls: ['../../suppliers/supplier-details/supplier-details.component.css']
})
export class DishIngredientsEditComponent implements OnInit {
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));

  public dish: Dish;
  public ingredient: DishIngredient;
  public ingredientsList = [];
  public invalidQty = false;
  public invalidEpWeight = false;
  public showConfirmControls = false;
  public submitButtonDisabled = true;
  private ingredientName: string;
  public id: string;
  public qty: string;
  public EP_weight: string;
  myForm: FormGroup;

  requiredQtyText = 'This value is required and must be greater than 0';
  requiredEpWeightText = 'decimal format required greater than 0 and less than 1';
  fieldValueGoodText = 'Looks Good';

  constructor(
    private fb: FormBuilder,
    private service: DishService,
    private route: ActivatedRoute,
    private breakpointObserver: BreakpointObserver,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    // because a manual page reload removes the param from the http request
    this.id = this.route.snapshot.paramMap.get('_id');
    this.ingredientName = this.route.snapshot.paramMap.get('ingredient_name').toLocaleLowerCase();
    if (this.id) {
      this.dish = this.service.loadLocalDishData();
      this.ingredientsList = JSON.parse(JSON.stringify(this.dish.ingredients));
      this.ingredient = this.ingredientsList.find(item => item.name === this.ingredientName);
      this.ingredient.EP_weight === ''
        ? (this.ingredient.EP_weight = '0')
        : (this.ingredient.EP_weight = this.ingredient.EP_weight);
      // this.ingredient.EP_weight === '' ? (toDecimal = parseFloat(this.ingredient.EP_weight) * 100) : (toDecimal = 0.0);

      this.myForm = this.fb.group({
        quantity: [this.ingredient.qty, [Validators.required, validQuantity]],
        epWeight: [this.ingredient.EP_weight, [Validators.required, validEpWeight]],
        complete: [this.ingredient.complete]
      });
      console.log(this.myForm);
    } else {
      console.log('no id sent');
    }
  }

  get f() {
    return this.myForm.controls;
  }

  get quantity() {
    return this.myForm.get('quantity');
  }

  get epWeight() {
    return this.myForm.get('epWeight');
  }

  get complete() {
    return this.myForm.get('complete');
  }

  onSubmitForm() {
   this.dish.ingredients.forEach((item, index) => {
      if (item.name === this.ingredientName) {
        this.dish.ingredients[index] = this.ingredient;
      }
    });
    // this.dish.ingredients = this.ingredientsList;
    this.service.updateDish(this.dish);
  }

  onUpdateIngredientProp(prop, value) {
    // because some formcontrol names are Camel Cased and object props are underscored if more than one word
    switch (prop) {
      case 'quantity':
        this.ingredient.qty = value;
        break;
      case 'epWeight':
        const val = parseFloat(value);
        this.ingredient.EP_weight = val.toFixed(2);
        break;
      case 'complete':
        this.toggleComplete();
        break;

      default:
        break;
    }

    this.myForm.get(prop).setValue(value);
    this.myForm.status === 'VALID' ? (this.showConfirmControls = true) : (this.showConfirmControls = false);
  }

  toggleComplete() {
    this.ingredient.complete = !this.ingredient.complete;
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
      console.log(prop);
      // 0 is an invalid amount
      if (result === 0) {
        if (prop === 'quantity') {
          this.invalidQty = true;
          return;
        }
        if (prop === 'epWeight') {
          this.invalidEpWeight = true;
          return;
        }
      }

      if (prop === 'quantity') {
        this.invalidQty = false;
        this.onUpdateIngredientProp('quantity', result);
      }

      if (prop === 'epWeight') {
        this.invalidEpWeight = false;
        this.onUpdateIngredientProp('epWeight', result);
        return;
      }
    });
  }
}
