import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LayoutModule } from '@angular/cdk/layout';
import { AuthInterceptor } from './auth/auth-interceptor';
import { ErrorInterceptor } from '../error-interceptor';
import { Globals } from './globals';

import { AppRoutingModule } from './app-routing.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AngularMaterialModule } from './angular-material';
import { MatDialogModule, MatToolbarModule, MatButtonModule, MatIconModule, MatListModule } from '@angular/material';
import { DishesModule } from './dishes/dishes.module';
import { IngredientsModule } from './ingredients/ingredients.module';
import { SuppliersModule } from './suppliers/suppliers.module';


import { MainComponent } from './main/main.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomepageComponent } from './homepage/homepage.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';

import { DialogLargeComponent } from './dialogs/dialog-large/dialog-large.component';
import { IngredientCreateHelpDialogComponent } from './dialogs/ingredient-create-help-dialog/ingredient-create-help-dialog.component';
import { NumpadDialogComponent } from './dialogs/numpad-dialog/numpad-dialog.component';
import { ErrorComponent } from './error/error.component';
import { MainNavComponent } from './main-nav/main-nav.component';
import { AuthService } from './auth/auth.service';




@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    HeaderComponent,
    FooterComponent,
    HomepageComponent,
    PageNotFoundComponent,
    SignupComponent,
    LoginComponent,
    DialogLargeComponent,
    IngredientCreateHelpDialogComponent,
    NumpadDialogComponent,
    ErrorComponent,
    MainNavComponent,
  ],
  imports: [
    NoopAnimationsModule,
    BrowserModule,
    MatSidenavModule,
    MatDialogModule,
    HttpClientModule,
    AngularMaterialModule,
    FormsModule,
    IngredientsModule,
    DishesModule,
    AppRoutingModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    SuppliersModule,

  ],
  entryComponents: [DialogLargeComponent, IngredientCreateHelpDialogComponent, NumpadDialogComponent, ErrorComponent],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    Globals,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
