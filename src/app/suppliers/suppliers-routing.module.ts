import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { SuppliersListComponent } from './suppliers-list/suppliers-list.component';
import { SupplierCreateComponent } from './supplier-create/supplier-create.component';
import { SupplierDetailsComponent } from './supplier-details/supplier-details.component';

const routes: Routes = [
  {
    path: 'list',
    component: SuppliersListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'create',
    component: SupplierCreateComponent,
    canActivate: [AuthGuard]
  },
  {
    path: ':id/details',
    component: SupplierDetailsComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuppliersRoutingModule {}
