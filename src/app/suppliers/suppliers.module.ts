import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../angular-material';
import { SuppliersRoutingModule } from './suppliers-routing.module';

import { SuppliersService } from './suppliers.service';
import { SuppliersListComponent } from './suppliers-list/suppliers-list.component';
import { SupplierCreateComponent } from './supplier-create/supplier-create.component';
import { SupplierDetailsComponent } from './supplier-details/supplier-details.component';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, AngularMaterialModule, SuppliersRoutingModule],
  providers: [SuppliersService],
  declarations: [SuppliersListComponent, SupplierCreateComponent, SupplierDetailsComponent]
})
export class SuppliersModule {}
