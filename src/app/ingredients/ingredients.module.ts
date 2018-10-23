import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../angular-material';
import { IngredientsRoutingModule } from './ingredients-routing.module';
import { FormsModule } from '@angular/forms';

import { IngredientsListComponent } from './ingredients-list/ingredients-list.component';
import { IngredientsDetailsComponent } from './ingredients-details/ingredients-details.component';
import { IngredientsCreateComponent } from './ingredients-create/ingredients-create.component';
import { IngredientEditFieldComponent } from './ingredient-edit-field/ingredient-edit-field.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IngredientsRoutingModule,
    AngularMaterialModule
  ],
  declarations: [IngredientsListComponent, IngredientsDetailsComponent, IngredientsCreateComponent, IngredientEditFieldComponent]
})
export class IngredientsModule { }
