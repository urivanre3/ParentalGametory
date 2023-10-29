import { Component, Optional } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Observable, Subscription, filter } from 'rxjs';
import { SignupComponent } from './signup/signup.component';
import { VideogamesComponent } from './admin/videogames/videogames.component';
import { ApiService } from './api.service';
import { SigninComponent } from './admin/signin/signin.component';



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
    this.isAdmin = component instanceof VideogamesComponent /* || component instanceof CustomersComponent || component instanceof OrdersComponent
      || component instanceof UsersComponent || component instanceof ReportsComponent*/ || component instanceof SigninComponent; 

    if (this.isAdmin) {
      this.title = component.title;

      if (!this.loggedIn) {
        if (!(component instanceof SigninComponent)) this.router.navigate(['/admin/signin']);
      }
      
      this.showSidebar = !(component instanceof SigninComponent);
    } else if(component instanceof SignupComponent) this.showNavbar = false;
  }


}
