import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DishCreateComponent } from './dish-create/dish-create.component';
import { DishesListComponent } from './dishes-list/dishes-list.component';
import { DishDetailsComponent } from './dish-details/dish-details.component';
import { DishIngredientsListComponent } from './dish-ingredients-list/dish-ingredients-list.component';
import { DishIngredientsEditComponent } from './dish-ingredients-edit/dish-ingredients-edit.component';
import { AuthGuard } from '../auth/auth.guard';
import { EditFieldComponent } from './edit-field/edit-field.component';
import { DishIngredientsListAddComponent } from './dish-ingredients-list-add/dish-ingredients-list-add.component';

const dishesRoutes: Routes = [
  // list all dishes
  { path: 'dishes',  component: DishesListComponent, canActivate: [AuthGuard]},
   // create a dish
  { path: 'dish/create', component: DishCreateComponent ,  canActivate: [AuthGuard]},
  // edit selected dish
  { path: 'dish/:_id', component: DishDetailsComponent ,  canActivate: [AuthGuard]},
  // editing root level properties on a dish we re-use the same component and pass in :field_name and :field_type
  { path: 'dish/edit-field/:_id/:field_name/:field_type', component: EditFieldComponent ,  canActivate: [AuthGuard]},
  /* List of ingredients for selected dish */
  { path: 'dish/:_id/ingredients', component: DishIngredientsListComponent ,  canActivate: [AuthGuard]},
  /* edit a selected ingredient */
  { path: 'dish/:_id/ingredient/:ingredient_name', component: DishIngredientsEditComponent ,  canActivate: [AuthGuard]},
  // add ingredient to selected dish
  { path: 'dish/:_id/ingredients/add', component: DishIngredientsListAddComponent ,  canActivate: [AuthGuard]}
];

@NgModule({
  imports: [

    RouterModule.forChild(dishesRoutes)
  ],

  exports: [
    RouterModule
  ]
})
export class DishesRoutingModule { }
