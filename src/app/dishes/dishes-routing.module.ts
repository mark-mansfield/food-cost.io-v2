import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { DishCreateComponent } from './dish-create/dish-create.component';
import { DishesListComponent } from './dishes-list/dishes-list.component';
import { DishDetailsV2Component } from './dish-details-v2/dish-details-v2.component';
import { DishIngredientsListComponent } from './dish-ingredients-list/dish-ingredients-list.component';
import { DishIngredientsEditComponent } from './dish-ingredients-edit/dish-ingredients-edit.component';
import { AuthGuard } from '../auth/auth.guard';
// import { EditFieldComponent } from './edit-field/edit-field.component';
import { DishIngredientsListAddComponent } from './dish-ingredients-list-add/dish-ingredients-list-add.component';
import { DishIngredientsAddComponent } from "./dish-ingredients-add/dish-ingredients-add.component";
const dishesRoutes: Routes = [
  // list all dishes
  { path: 'dishes/list', component: DishesListComponent, canActivate: [AuthGuard] },

  // add / edit dish
  { path: 'dish/:mode', component: DishDetailsV2Component, canActivate: [AuthGuard] },

  /* List of ingredients for selected dish */
  { path: 'dish/:_id/ingredients', component: DishIngredientsListComponent, canActivate: [AuthGuard] },

  /* edit a selected ingredient */
  { path: 'dish/:_id/ingredient/:ingredient_name', component: DishIngredientsEditComponent, canActivate: [AuthGuard] },

  // add ingredient to selected dish
  { path: 'dish/:_id/ingredients/add', component: DishIngredientsListAddComponent, canActivate: [AuthGuard] },

  // add ingredient to selected dish
  { path: 'dish/:_id/ingredients/add-1', component: DishIngredientsAddComponent, canActivate: [AuthGuard] },

  // return to edit a dish withextra param to manage state
  { path: 'dish/:mode/:showEditTools', component: DishDetailsV2Component, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(dishesRoutes)],

  exports: [RouterModule]
})
export class DishesRoutingModule { }
