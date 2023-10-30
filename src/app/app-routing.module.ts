import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AgregarjuegoComponent } from './games/agregarjuego/agregarjuego.component';
import { GamesComponent } from './games/games.component';
import { HomeComponent } from './home/home.component';
import { SigninComponent } from './admin/signin/signin.component';
import { VideogamesComponent } from './admin/videogames/videogames.component';
import { RoleGuard } from './shared/role.guard';
import { SignupComponent } from './signup/signup.component';
import { SearchComponent } from './search/search.component';
import { AuthGuard } from './shared/auth.guard';

const routes: Routes = [


  {path:'app' , component:AppComponent},
 

/*   {path: 'videojuego/:id', component: GamesComponent, canActivate: [AuthGuard]}, */
  
  {path: 'videojuego/:id', component: GamesComponent},
  {path: 'videojuego:id', component: GamesComponent},
  
  {path: 'signup', component: SignupComponent},

  {path: 'home', component: HomeComponent},
/*   {path: 'fruits', component: FruitsComponent},
  {path: 'vegetables', component: VegetablesComponent},
  {path: 'dairy', component: DairyComponent},
  {path: 'mycart', component: MycartComponent},
  {path: 'orders', component: CustomerordersComponent},
  {path: 'about', component: AboutComponent}, */
  {path: 'search', component: SearchComponent},
/*   {path: 'contact', component: ContactComponent}, */
  
/*   {path: 'faq', component: FaqComponent},
  {path: 'question', component: QuestionComponent}, */


/*   {path: 'product:id', component: VerUnProductoComponent},
  {path: 'product/:id', component: VerUnProductoComponent}, */




  //Admin
  
   
  {path: 'admin', pathMatch: 'full', redirectTo: 'admin/videogames'},
  {path: 'admin/videogames', component:VideogamesComponent},
/* {path: 'admin/customers', component: CustomersComponent}, */
/* {path: 'admin/orders', component: OrdersComponent}, */
/* {path: 'admin/users', component: UsersComponent}, */
/* {path: 'admin/reports', component: ReportsComponent}, */
   {path: 'admin/signin', component: SigninComponent,canActivate:[RoleGuard], data: { expectedRole: 'true' } },


   {path: '**', pathMatch: 'full', redirectTo: 'home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
