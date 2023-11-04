import { Component, OnDestroy, OnInit, Optional, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { EMPTY, map, Observable, of, Subscription } from 'rxjs';
import { ApiService } from '../api.service';
import { JwtHelperService } from '@auth0/angular-jwt';
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

  aux = {  email: '',  password: '' }
  // Form
  form: FormGroup;

  // Show
  loggedIn: Observable<boolean> = of(false);
  userData: any = null;
  



  // Constructor
  constructor( private api: ApiService, private jwtHelper: JwtHelperService, private router: Router) {
    
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

  abrirModal(): void {
    this.modal.show();
  }

  async iniciodesesion() {
    this.aux.email=this.form.value['email'];
    this.aux.password=this.form.value['password'];


      console.log(this.aux);
      this.api.iniciar_sesion(this.aux).subscribe( (res:any) => {
        if (res.token) {
          localStorage.setItem('token', res.token);
    
          // Verificar si el token es válido
          if (!this.jwtHelper.isTokenExpired(res.token)) {
            // Decodificar el token para obtener los datos del usuario
            const userData = this.jwtHelper.decodeToken(res.token);
            console.log('Datos del usuario:', userData);
    
            // Ahora puedes acceder a los datos del usuario, por ejemplo:
            const userId = userData.UsuarioID;
            const userName = userData.NombreUsuario;
            const userEmail = userData.CorreoElectronico;


            console.log('UsuarioID:', userData.UsuarioID);
            console.log('NombreUsuario:', userData.NombreUsuario);
            console.log('CorreoElectronico:', userData.CorreoElectronico);
    
            // Redirige al usuario a la página de inicio
            this.router.navigate(['/home']);
            this.modal.hide();
          }
          
        }
      })
  }

  async logout() {
    // Llamada a la función del servicio para cerrar la sesión
    this.api.logout().subscribe(() => {
      // Elimina el token
      localStorage.removeItem('token');
      console.log("Sesión cerrada exitosamente");
      // Actualiza loggedIn a false ya que el usuario ha cerrado la sesión
      this.loggedIn = of(false);
      // Redirige al usuario a la página de inicio
      this.router.navigate(['/home']);
    });
  }


  





}
