import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../angular-material';
import { MenusRoutingModule } from './menus-routing.module';

import { MenusService } from './menus.service';

import { MenusListComponent } from './menus-list/menus-list.component';
import { MenuDetailsComponent } from './menu-details/menu-details.component';
import { MenuCreateComponent } from './menu-create/menu-create.component';
import { MenuAddDishComponent } from './menu-add-dish/menu-add-dish.component';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, AngularMaterialModule, MenusRoutingModule],
  providers: [MenusService],
  declarations: [MenusListComponent, MenuDetailsComponent, MenuCreateComponent, MenuAddDishComponent]
})
export class MenusModule {}
