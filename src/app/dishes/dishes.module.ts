import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material';
import { DishesRoutingModule } from './dishes-routing.module';

import { DishDetailsComponent } from './dish-details/dish-details.component';
import { DishesListComponent } from './dishes-list/dishes-list.component';
import { DishCreateComponent } from './dish-create/dish-create.component';
import { EditFieldComponent } from './edit-field/edit-field.component';
import { DishIngredientsListAddComponent } from './dish-ingredients-list-add/dish-ingredients-list-add.component';
import { DishIngredientsListComponent } from './dish-ingredients-list/dish-ingredients-list.component';
import { DishIngredientsEditComponent } from './dish-ingredients-edit/dish-ingredients-edit.component';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DishesRoutingModule, AngularMaterialModule],
  declarations: [
    DishDetailsComponent,
    DishesListComponent,
    DishCreateComponent,
    EditFieldComponent,
    DishIngredientsListAddComponent,
    DishIngredientsListComponent,
    DishIngredientsEditComponent
  ]
})
export class DishesModule {}
