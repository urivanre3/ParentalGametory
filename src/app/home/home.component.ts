import { Component, Input, OnInit } from '@angular/core';
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
  intereses: any = null;

  @Input() recomendaciones_datos_array: any[] = [];
  constructor(private api: ApiService) {
    this.flag_search = false;
  }

  cualidades = [
    { id: 1, nombre: 'Humanidades y Emociones' },
    { id: 2, nombre: 'Historica' },
    { id: 3, nombre: 'Cultural' },
    { id: 4, nombre: 'Aritmetica' },
    { id: 5, nombre: 'Logica' },
    { id: 6, nombre: 'Accesibilidad' },
    { id: 7, nombre: 'Creatividad' },
    { id: 8, nombre: 'Lectura y Lenguaje' },
    // Agrega las otras cualidades aquí
  ];

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
                  (datosintereses) => {
                    this.intereses = datosintereses[0];
                    console.log(
                      'Datos de interés asociados al último perfil:',
                      this.intereses
                    );
                    console.log(
                      'último perfil:',
                      this.intereses.PerfilObjetivoID
                    );
                    this.llamarRecomendacionAutomatica();

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

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
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
  recomendaciones_datos: { [key: number]: any } = {};
  recomendaciones: any[] = [];
  recomendacionesCargadas = false;
  calificacionesGlobales: any[] = []; // Initialize the array
  private recommendationCalled = false;


  // Método para llamar a la recomendación automática después de obtener los intereses
  llamarRecomendacionAutomatica() {
    // Check if recommendations have already been called
    if (!this.recommendationCalled) {
      this.recommendationCalled = true; // Set the flag to true to prevent further calls

      this.api.obtenerRecomendaciones(this.intereses.PerfilObjetivoID).subscribe(
        (recomendaciones) => {
          console.log('Recomendaciones de juegos:', recomendaciones);
          this.recomendaciones = recomendaciones;
          this.recomendacionesCargadas = true;

          // Obtener detalles de cada juego recomendado
          this.obtenerDetallesJuegos();
        },
        (error) => {
          console.error('Error al obtener las recomendaciones de juegos', error);
          // Reset the flag if there's an error to allow retrying
          this.recommendationCalled = false;
          // Maneja el error de manera apropiada
        }
      );
    }
  }

  // Método para obtener detalles de cada juego recomendado
  obtenerDetallesJuegos() {
    // Iterar sobre cada recomendación y realizar una solicitud para obtener detalles
    this.recomendaciones.forEach((recomendacion_id) => {
      const juegoId = recomendacion_id.JuegoID;
  
      this.api.getjuego_por_id(juegoId).subscribe(
        (detallesJuego) => {
          // Agregar los detalles del juego al array
          this.recomendaciones_datos_array.push(detallesJuego.data[0]);
  
          // Verificar si ya has obtenido detalles para todos los juegos recomendados
          if (this.recomendaciones_datos_array.length === this.recomendaciones.length) {
            // Ahora puedes usar this.recomendaciones_datos_array en tu plantilla

            console.log('Juegos recomendados:', this.recomendaciones_datos_array);
            this.obtenerCalificacionesGlobales();
          }
        },
        (error) => {
          console.error(
            `Error al obtener detalles del juego ${juegoId}`,
            error
          );
          // Maneja el error de manera apropiada
        }
      );
    });
  }


  obtenerCalificacionesGlobales() {
    this.recomendaciones_datos_array.forEach((recomendacion) => {
      const juegoId = recomendacion.JuegoID;
  
      this.api.obtenerCalificacionGlobal(juegoId).subscribe(
        (calificacionesGlobales) => {
          console.log('Calificaciones globales:', calificacionesGlobales);
          
          // Store calificacionesGlobales for each juegoId
          this.calificacionesGlobales[juegoId] = calificacionesGlobales;
  
          // Now you can use this.calificacionesGlobales in your template
        },
        (error) => {
          console.error('Error al obtener las calificaciones globales:', error);
        }
      );
    });
  }

  combineRecomendacionesAndCalificaciones() {
    return this.recomendaciones_datos_array.map((recomendacion) => {
      return {
        ...recomendacion,
        calificacionesGlobales: this.calificacionesGlobales[recomendacion.JuegoID],
      };
    });
  }
}
