import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material';
import { DishesRoutingModule } from './dishes-routing.module';


import { DishDetailsComponent } from './dish-details/dish-details.component';
import { DishesListComponent } from './dishes-list/dishes-list.component';

import { DishCreateComponent } from './dish-create/dish-create.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DishesRoutingModule,
    AngularMaterialModule
  ],
  declarations: [
      DishDetailsComponent,
      DishesListComponent,
      DishCreateComponent
    ]
})
export class DishesModule { }
