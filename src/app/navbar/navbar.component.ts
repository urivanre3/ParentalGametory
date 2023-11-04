import { Component, OnDestroy, OnInit, Optional, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { EMPTY, map, Observable, of, Subscription } from 'rxjs';
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

  aux = {
    email: '',
    password: ''
  }

  // Form
  form: FormGroup;

  // Show
  loggedIn: Observable<boolean> = EMPTY; // Cambio a Observable para reflejar el estado de autenticación
  user: Observable<any | null> = EMPTY;



  // Constructor
  constructor( private api: ApiService, private router: Router) {
    
    // Form
    this.form = new FormGroup({
      'email': new FormControl('', Validators.required),
      'password': new FormControl('', Validators.required)
    });

    this.api.isUserAuthenticated().subscribe((authenticated: boolean) => {
      this.loggedIn = of(authenticated); // Conviértelo a un Observable
    });
    
    this.api.getUserData().subscribe((userData: any) => {
      this.user = of(userData); // Conviértelo a un Observable
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

  abrirModal(): void {
    this.modal.show();
  }

  async iniciodesesion() {
    this.aux.email=this.form.value['email'];
    this.aux.password=this.form.value['password'];


      console.log(this.aux);
      this.api.iniciar_sesion(this.aux).subscribe( (res:any) => {
        console.log(res);
        localStorage.setItem('token',res.token);
        this.router.navigate(['/home']);
        this.modal.hide();
      })
  }

  async logout() {

    this.router.navigate(['/home']);
  }


  





}
