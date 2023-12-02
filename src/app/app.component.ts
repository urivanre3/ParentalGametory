import { Component, Optional } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Observable, Subscription, filter } from 'rxjs';
import { SignupComponent } from './signup/signup.component';
import { VideogamesComponent } from './admin/videogames/videogames.component';
import { ApiService } from './api.service';
import { SigninComponent } from './admin/signin/signin.component';
import { HomeComponent } from './home/home.component';
import { PerfilesComponent } from './perfiles/perfiles.component';
import { GamesComponent } from './games/games.component';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  


  // Attributes
  isAdmin: boolean = false;
  title: string = '';
  url: string = '';
  showNavbar: boolean = true;
  showSidebar: boolean = false;
  loggedIn: boolean = false;
  key : string ='session'
  user: any[] = [];
  // Auth
  private readonly userDisposable: Subscription | undefined;
/*   public readonly user: Observable<User | null> = EMPTY; */

  constructor(@Optional() private auth: Boolean, private router: Router, private api : ApiService) {
    if (localStorage.getItem(this.key)) {

      let data = localStorage.getItem("key");
       
        this.api.iniciar_sesion(data).subscribe((res:any) => {
          console.log('session this api gets');
          this.user = res.data;
          console.log('this.user ' + this.user[0].titulo);
          this.loggedIn = true;
        });
  
      }else{
        console.log('No data detected');      
      
    }
  }

  ngOnInit(): void {
    // Path    
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.url = this.router.url;
    });
  }

  ngOnDestroy(): void {
    if (this.userDisposable) {
      this.userDisposable.unsubscribe();
    }
  }

  // On Activated
  onActivated(component: any) {
    if(component instanceof SignupComponent) this.showNavbar = false;
    if(component instanceof HomeComponent) this.showNavbar = true ,this.isAdmin=false;
    if(component instanceof PerfilesComponent) this.showNavbar = false, this.isAdmin=true;
    if(component instanceof VideogamesComponent) this.showNavbar = true;
    if(component instanceof GamesComponent) this.showNavbar = true;
  }


}
