import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
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
  public readonly wrongData!: SwalComponent;
  modal: any;

  aux = { email: '', password: '' };
  form: FormGroup;

  private userSubscription: Subscription | undefined; // Para gestionar la suscripción
  loggedIn = false; // Cambiado a un valor booleano
  userData: any = null;

  constructor(private api: ApiService, private router: Router) {
    this.form = new FormGroup({
      'email': new FormControl('', Validators.required),
      'password': new FormControl('', Validators.required)
    });

    this.userSubscription = this.api.isUserAuthenticated().subscribe((authenticated: boolean) => {
      this.loggedIn = authenticated;
      if (authenticated) {
        this.api.getUserData().subscribe((userData: any) => {
          this.userData = userData; // Asigna los datos del usuario
        });
      }
    });
  }

  ngOnInit(): void {
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

    this.api.iniciar_sesion(this.aux).subscribe((res: any) => {
      localStorage.setItem('token', res.token);

      // Después de iniciar sesión, actualiza el estado de autenticación y los datos del usuario
      this.loggedIn = true;
      this.api.getUserData().subscribe((userData: any) => {
        this.userData = userData;
      });

      this.router.navigate(['/home']);
      this.modal.hide();
    });
  }

  async logout() {
    this.api.logout().subscribe(() => {
      // Elimina el token
      localStorage.removeItem('token');
      console.log("Sesión cerrada exitosamente");

      // Después de cerrar sesión, actualiza el estado de autenticación y los datos del usuario
      this.loggedIn = false;
      this.userData = null;

      this.router.navigate(['/home']);
    });
  }
}