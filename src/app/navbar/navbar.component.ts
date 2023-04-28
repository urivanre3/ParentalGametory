import { Component, OnDestroy, OnInit, Optional, ViewChild } from '@angular/core';
/* import { Auth, authState, User, signInWithEmailAndPassword, signOut } from '@angular/fire/auth'; */
/* import { traceUntilFirst } from '@angular/fire/performance'; */
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { EMPTY, map, Observable, Subscription } from 'rxjs';
import { ApiService } from '../api.service';
declare var window: any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {


  // View
  @ViewChild('wrongData')
  public readonly wrongData!: SwalComponent;
 
  // Modal
  modal: any;

  // Attributes
  private readonly userDisposable: Subscription | undefined;
  public readonly user : Observable<any | null> = EMPTY;
  aux = {
    email: '',
    password: ''
  }

  // Form
  form: FormGroup;

  // Show
  loggedIn: boolean = false;

  // Constructor
  constructor(/* @Optional() private auth: Auth, */ private api: ApiService, private router: Router) {
    /* if (auth) {
      this.user = authState(this.auth);

      this.userDisposable = authState(this.auth).pipe(
        traceUntilFirst('auth'),
        map(u => !!u)
      ).subscribe(isLoggedIn => {        
        if (isLoggedIn) {
          this.loggedIn = isLoggedIn;
          apiService.getCustomer(auth.currentUser?.uid ?? '').subscribe(async (user: any) => {
            if (user.customClaims && user.customClaims['admin']) {
              await this.wrongData.fire();
              await signOut(this.auth);
            }
          });
          //router.navigate(['/admin']);
        }
      });
    } */
    
    // Form
    this.form = new FormGroup({
      'email': new FormControl('', Validators.required),
      'password': new FormControl('', Validators.required)
    });
  }

  // OnInit
  ngOnInit(): void {
    this.modal = new window.bootstrap.Modal(
      document.getElementById('modal')
    );
  }

  ngOnDestroy(): void {
    if (this.userDisposable) {
      this.userDisposable.unsubscribe();
    }
  }

  openModal(): void {
    this.modal.show();
  }

  async login() {
    this.aux.email=this.form.value['email'];
    this.aux.password=this.form.value['password'];
/*     await signInWithEmailAndPassword(this.auth, this.form.value['email'], this.form.value['password'])
      .then((user) => {
        this.modal.hide();
      })
      .catch(async (error) => {
        await this.wrongData.fire();        
      }); */

      console.log(this.aux);
      this.api.singin(this.aux).subscribe( (res:any) => {
        console.log(res);
        localStorage.setItem('token',res.token);
        this.router.navigate(['home']);
      })
  }

  async logout() {
   /*  await signOut(this.auth); */
    this.router.navigate(['/home']);
  }

}
