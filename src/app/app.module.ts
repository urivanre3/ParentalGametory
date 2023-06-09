import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgregarjuegoComponent } from './games/agregarjuego/agregarjuego.component';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { SearchComponent } from './search/search.component';
import { LoadingComponent } from './loading/loading.component';
import { CardComponent } from './card/card.component';
import { SignupComponent } from './signup/signup.component';
import { VideogamesComponent } from './admin/videogames/videogames.component';
import { SigninComponent } from './admin/signin/signin.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { LoginComponent } from './login/login.component';

// Providers
import { JwtHelperService, JWT_OPTIONS }  from '@auth0/angular-jwt'
import { AuthInterceptor } from './shared/AuthInterceptor';
import { SidebarComponent } from './admin/sidebar/sidebar.component';
import { HeaderComponent } from './admin/header/header.component';
import { PagetitleComponent } from './admin/pagetitle/pagetitle.component'; 
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    AgregarjuegoComponent,
    HomeComponent,
    SearchComponent,
    LoadingComponent,
    CardComponent,
    SignupComponent,
    VideogamesComponent,
    SigninComponent,
    LoginComponent,
    SidebarComponent,
    HeaderComponent,
    PagetitleComponent,
    
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    SweetAlert2Module.forRoot()
  ],
  providers: [
     // JWT
     { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
     JwtHelperService,
    // Token interceptor
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
