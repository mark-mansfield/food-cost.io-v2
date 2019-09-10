import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../angular-material';
import { IngredientsRoutingModule } from './ingredients-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedComponentsModule } from '../shared-components/shared-components.module';

import { IngredientsCreateComponent } from './ingredients-create/ingredients-create.component';
import { IngredientsImportComponent } from './ingredients-import/ingredients-import.component';
import { IngredientsListV2Component } from './ingredients-list-v2/ingredients-list-v2.component';
import { IngredientDetailsV2Component } from './ingredient-details-v2/ingredient-details-v2.component';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, FormsModule, IngredientsRoutingModule, AngularMaterialModule, SharedComponentsModule],
  declarations: [
    // IngredientsListComponent,
    IngredientsCreateComponent,
    IngredientsImportComponent,
    IngredientsListV2Component,
    IngredientDetailsV2Component,

  ]
})
export class IngredientsModule { }
