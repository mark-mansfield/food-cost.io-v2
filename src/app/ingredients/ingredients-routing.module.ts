import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
// import { IngredientsListComponent } from './ingredients-list/ingredients-list.component';
// import { IngredientsDetailsComponent } from './ingredients-details/ingredients-details.component';
// import { IngredientEditFieldComponent } from './ingredient-edit-field/ingredient-edit-field.component';
import { IngredientDetailsV2Component } from './ingredient-details-v2/ingredient-details-v2.component';

import { IngredientsImportComponent } from './ingredients-import/ingredients-import.component';
import { IngredientsListV2Component } from './ingredients-list-v2/ingredients-list-v2.component';
const ingredientsRoutes: Routes = [
  //  list all ingredients
  {
    path: 'ingredients/list',
    component: IngredientsListV2Component,
    canActivate: [AuthGuard]
  },
  // add / edit ingredient
  {
    path: 'ingredient/:mode',
    component: IngredientDetailsV2Component,
    canActivate: [AuthGuard]
  },
  // import ingredients
  {
    path: 'ingredients/import',
    component: IngredientsImportComponent,
    canActivate: [AuthGuard]
  }
  // // ingredient details
  // {
  //   path: 'ingredient/:mode',
  //   component: IngredientDetailsV2Component,
  //   canActivate: [AuthGuard]
  // }
  // editing root level properties on an ingredient we re-use the same component and pass in :field_name and :field_type
  // {
  //   path: 'ingredient/edit-field/:field_name/:field_type',
  //   component: IngredientEditFieldComponent,
  //   canActivate: [AuthGuard]
  // }
];
@NgModule({
  imports: [RouterModule.forChild(ingredientsRoutes)],

  exports: [RouterModule]
})
export class IngredientsRoutingModule {}
