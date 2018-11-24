import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../angular-material';
import { IngredientsRoutingModule } from './ingredients-routing.module';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IngredientsListComponent } from './ingredients-list/ingredients-list.component';
import { IngredientsDetailsComponent } from './ingredients-details/ingredients-details.component';
import { IngredientsCreateComponent } from './ingredients-create/ingredients-create.component';
import { IngredientEditFieldComponent } from './ingredient-edit-field/ingredient-edit-field.component';
import { IngredientsImportComponent } from './ingredients-import/ingredients-import.component';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, FormsModule, IngredientsRoutingModule, AngularMaterialModule],
  declarations: [
    IngredientsListComponent,
    IngredientsDetailsComponent,
    IngredientsCreateComponent,
    IngredientEditFieldComponent,
    IngredientsImportComponent
  ]
})
export class IngredientsModule {}
