import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IngredientsService } from '../ingredients.service';
import { IngredientCreateHelpDialogComponent } from '../../dialogs/ingredient-create-help-dialog/ingredient-create-help-dialog.component';
import { NumpadDialogComponent } from '../../dialogs/numpad-dialog/numpad-dialog.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-ingredients-create',
  templateUrl: './ingredients-create.component.html',
  styleUrls: ['./ingredients-create.component.css']
})
export class IngredientsCreateComponent implements OnInit {
  ingredient_name = '';
  ingredient_price = '';
  unit_amount = '';
  purchase_amount = '';
  unit_type = '';
  supplier = '';
  category = '';
  sub_category = '';
  message = '';
  suppliers = [];
  unit_types = [];
  isLoading = false;
  hasCategory = false;
  hasSubCategory = false;
  priceRequired = true;
  unitAmountRequired = true;
  unitTypeRequired = true;
  purchaseAmountRequired = true;
  inputPrice = '';
  inputUnitAmount = '';
  inputPurchaseAmount = '';
  localCurrency = 'AUD';

  constructor(private ingredientsService: IngredientsService, public dialog: MatDialog) {}

  ngOnInit() {
    this.suppliers = this.ingredientsService.getSuppliers();
    this.unit_types = this.ingredientsService.getUnitTypes();
  }

  onAddIngredient(form: NgForm) {
    // console.log(form.status);
    if (form.invalid) {
      return;
    }

    this.ingredientsService.createIngredient(
      form.value.ingredient_name,
      this.inputPrice,
      this.inputUnitAmount,
      this.inputPurchaseAmount,
      form.value.unit_type,
      form.value.supplier,
      form.value.category,
      form.value.sub_category
    );
  }

  launchNumberPad(el: string) {
    const dialogRef = this.dialog.open(NumpadDialogComponent, {
      width: '548px',
      height: '700px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(el);
        switch (el) {
          case 'ingredient_price':
            this.inputPrice = result;
            this.ingredient_price = this.inputPrice;
            this.priceRequired = false;
            break;
          case 'unit_amount':
            this.inputUnitAmount = result;
            this.unit_amount = this.inputUnitAmount;
            this.unitAmountRequired = false;
            break;
          case 'purchase_amount':
            this.inputPurchaseAmount = result;
            this.purchase_amount = this.inputPurchaseAmount;
            this.purchaseAmountRequired = false;
            break;
          default:
            break;
        }
      } else {
      }
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(IngredientCreateHelpDialogComponent, {
      width: '80vw',
      height: '80vh'
    });
    dialogRef.afterClosed().subscribe(result => {});
  }

  onOpenDialog() {
    this.openDialog();
  }

  onLaunchNumberPad(el) {
    this.launchNumberPad(el);
  }
}
