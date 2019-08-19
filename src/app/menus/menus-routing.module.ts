import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { MenusListComponent } from './menus-list/menus-list.component';
import { MenuDetailsComponent } from './menu-details/menu-details.component';
import { MenuCreateComponent } from './menu-create/menu-create.component';
import { MenuAddDishComponent } from './menu-add-dish/menu-add-dish.component';

const routes: Routes = [
  {
    path: 'list',
    component: MenusListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: ':id/add-dish',
    component: MenuAddDishComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'create',
    component: MenuCreateComponent,
    canActivate: [AuthGuard]
  },
  {
    path: ':id/details',
    component: MenuDetailsComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenusRoutingModule {}
