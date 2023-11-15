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

import { LoginComponent } from './login/login.component';

// Providers
import { JwtHelperService, JWT_OPTIONS }  from '@auth0/angular-jwt'
import { AuthInterceptor } from './shared/AuthInterceptor';
import { SidebarComponent } from './admin/sidebar/sidebar.component';
import { HeaderComponent } from './admin/header/header.component';
import { PagetitleComponent } from './admin/pagetitle/pagetitle.component'; 
import { RouterModule } from '@angular/router';
import { PerfilesComponent } from './perfiles/perfiles.component';
import { GamesComponent } from './games/games.component';
/* import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; */
/* import { NgChartsModule } from 'ng2-charts'; */
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
    PerfilesComponent,
    GamesComponent
    
    
  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
/*     NgxChartsModule,
    BrowserAnimationsModule */
   /*  NgChartsModule, */
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
