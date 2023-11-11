import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  private userSubscription: Subscription | undefined; // Para gestionar la suscripción
  loggedIn = false; // Cambiado a un valor booleano
  datosusuario: any = null;

  constructor(private api: ApiService) {
    this.flag_search = false;
  }

  ngOnInit(): void {
    this.userSubscription = this.api
      .isUserAuthenticated()
      .subscribe((authenticated: boolean) => {
        this.loggedIn = authenticated;
        if (authenticated) {
          this.api.getUserData().subscribe((respuestausuario: any) => {
            this.datosusuario = respuestausuario; // Asigna los datos del usuario

            console.log(
              'Nombre de usuario: ' + this.datosusuario.NombreUsuario
            );
            console.log(
              'Correo electrónico: ' + this.datosusuario.CorreoElectronico
            );
            console.log('Número de id: ' + this.datosusuario.UsuarioID);

            this.api.obtenerUltimoPerfil(this.datosusuario.UsuarioID).subscribe(
              (response) => {
                // Maneja la respuesta del servidor, response contiene el último perfil seleccionado
                const ultimoPerfil = response.UltimoPerfil;
                console.log('Último perfil seleccionado:', ultimoPerfil);


                this.api.obtenerInteres(ultimoPerfil).subscribe(
                  (intereses) => {
                    console.log('Datos de interés asociados al último perfil:', intereses);





                    //aqui se realiza la recomendacion automatica inteligente



                  },
                  (error) => {
                    console.error('Error al obtener los intereses:', error);
                  }
                );


              },
              (error) => {
                console.error('Error al obtener el último perfil:', error);
              }
            );
          });
        }
      });
  }

  flag_search?: boolean;

  message: string | undefined;

  receiveMessage($event: string | undefined) {
    if ($event == 'yes') {
      this.flag_search = true;
    } else {
      this.flag_search = false;
    }
  }
}
