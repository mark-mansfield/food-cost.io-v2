
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AngularMaterialModule } from './angular-material';



import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomepageComponent } from './homepage/homepage.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AppRoutingModule } from './app-routing.module';
import { DishesModule } from './dishes/dishes.module';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthInterceptor } from './auth/auth-interceptor';


// const appRoutes: Routes = [
//   { path : 'home' , component: HomepageComponent },
//   { path: '', redirectTo: '/home', pathMatch: 'full' },
//   { path: '**', component: PageNotFoundComponent },
// ];


@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    HeaderComponent,
    FooterComponent,
    HomepageComponent,
    PageNotFoundComponent,
    SignupComponent,
    LoginComponent
    // ErrorComponent,
    // ReactiveFormsModule,
    // MatPaginatorModule
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    DishesModule,
    AppRoutingModule,
    HttpClientModule,
    AngularMaterialModule,
    FormsModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor , multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
