import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthGuard } from './auth/auth.guard';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HomepageComponent } from './homepage/homepage.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { MainNavComponent } from './main-nav/main-nav.component';

const appRoutes: Routes = [
  {
    path: 'homepage',
    component: HomepageComponent
  },

  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'dishes', loadChildren: './dishes/dishes.module#DishesModule' },
  {
    path: 'ingredients',
    loadChildren: './ingredients/ingredients.module#IngredientsModule'
  },
  {
    path: 'menus',
    loadChildren: './menus/menus.module#MenusModule'
  },
  {
    path: 'suppliers',
    loadChildren: './suppliers/suppliers.module#SuppliersModule'
  },
  { path: '', redirectTo: '/homepage', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      {
        enableTracing: false
      } // <-- debugging purposes only
    ),
    CommonModule
  ],
  exports: [RouterModule],
  providers: [AuthGuard],
  declarations: []
})
export class AppRoutingModule {}
