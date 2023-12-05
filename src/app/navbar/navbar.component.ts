import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { ApiService } from '../api.service';
declare var window: any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  @ViewChild('wrongData')

  modal: any;

  aux = { email: '', password: '' };
  form: FormGroup;

  private userSubscription: Subscription | undefined; // Para gestionar la suscripción
  loggedIn = false; // Cambiado a un valor booleano
  userData: any = null;

  loginError: string | null = null;

  constructor(private api: ApiService, private router: Router) {
    this.form = new FormGroup({
      'email': new FormControl('', Validators.required),
      'password': new FormControl('', Validators.required)
    });

    this.userSubscription = this.api.isUserAuthenticated().subscribe((authenticated: boolean) => {
    
      if (authenticated) {
          this.loggedIn = authenticated;
        this.api.getUserData().subscribe((userData: any) => {
          this.userData = userData; // Asigna los datos del usuario
        });
      }
    });
  }

  ngOnInit(): void {
    this.modal = new window.bootstrap.Modal(document.getElementById('modal'));
  }

  ngAfterViewInit(): void {
    this.modal = new window.bootstrap.Modal(document.getElementById('modal'));
  }
  
  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe(); // Asegúrate de cancelar la suscripción cuando el componente se destruye
    }
  }



  abrirModal(): void {
    this.modal.show();
  }

  async iniciodesesion() {
    this.aux.email = this.form.value['email'];
    this.aux.password = this.form.value['password'];

    this.api.iniciar_sesion(this.aux).subscribe(
      (res: any) => {
        if (res.token) {
          localStorage.setItem('token', res.token);

          // Después de iniciar sesión, actualiza el estado de autenticación y los datos del usuario
          this.api.getUserData().subscribe(
            (userData: any) => {
              this.loggedIn = true;
              this.userData = userData;
            },
            (error) => {
              console.error('Error al obtener datos del usuario:', error);
            }
          );

          this.router.navigate(['/home']);
          this.modal.hide();
        } else {
          this.loginError = 'Error: Token no recibido en la respuesta del servidor.';
          // Puedes manejar el error de otra manera si es necesario
        }
      },
      (error) => {
        if (error.status === 401) {
          this.loginError = 'Correo electrónico o contraseña incorrectos.';
        } else {
          this.loginError = 'Error al iniciar sesión. Inténtelo de nuevo más tarde.';
          // Puedes manejar otros códigos de error aquí
        }
      }
    );
  }


  async logout() {
    this.api.logout().subscribe(() => {
      // Elimina el token
      localStorage.removeItem('token');
      console.log("Sesión cerrada exitosamente");

      // Después de cerrar sesión, actualiza el estado de autenticación y los datos del usuario
      this.loggedIn = false;
      this.userData = null;

      window.location.reload();
    });
  }
}