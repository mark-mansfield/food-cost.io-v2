import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { IngredientsListComponent } from './ingredients-list/ingredients-list.component';
import { IngredientsDetailsComponent } from './ingredients-details/ingredients-details.component';
import { IngredientsCreateComponent } from './ingredients-create/ingredients-create.component';
import { Ingredient } from './ingredient.model';
import { IngredientEditFieldComponent } from './ingredient-edit-field/ingredient-edit-field.component';

const ingredientsRoutes: Routes = [
  //  list all ingredients
  { path: 'ingredients/list',  component: IngredientsListComponent, canActivate: [AuthGuard]},
  // add ingredient
  { path: 'ingredients/create' , component: IngredientsCreateComponent, canActivate: [AuthGuard]},
  // ingredient details
  { path: 'ingredients/:id',  component: IngredientsDetailsComponent, canActivate: [AuthGuard]},
  // editing root level properties on an ingredient we re-use the same component and pass in :field_name and :field_type
  { path: 'ingredient/edit-field/:field_name/:field_type', component: IngredientEditFieldComponent ,  canActivate: [AuthGuard]},


];
@NgModule({
  imports: [
    RouterModule.forChild(ingredientsRoutes)
  ],

  exports: [
    RouterModule
  ]
})
export class IngredientsRoutingModule { }
