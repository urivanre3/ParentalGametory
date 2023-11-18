import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../api.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
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

  constructor(private api: ApiService, private router: Router) {
    this.flag_search = false;
  }

  ngOnInit(): void {
    this.inicializarDatos();
  }

  flag_search?: boolean;

  message: string | undefined;

  recomendaciones: any[] = []; // Declaración de la propiedad recomendacione
  calificacionesGlobales: any[] = [];
  datosjuegos: any[] = [];

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
  @ViewChild('div_Grafica', { static: false }) divGrafica!: ElementRef;
  receiveMessage($event: string | undefined) {
    if ($event === 'yes') {
      // Acciones cuando la barra de búsqueda está activada
      this.flag_search = true;
    } else if ($event === 'cleared') {
      // Acciones cuando se borra la búsqueda
      this.flag_search = false;
      this.cualidades = []; // Limpiar las cualidades al borrar la búsqueda
      this.llamarRecomendacionAutomatica();
    }
  }
  onImageError(event: any) {
    event.target.src = '/assets/ImagenError.png'; // Reemplaza con la ruta de tu imagen de error
  }
  seeProduct(item: any) {
    console.log('metodo ver juego');
    let JuegoID;
    JuegoID = item.JuegoID;
    console.log('JuegoID == ' + JuegoID);
    this.router.navigate(['/videojuego', JuegoID]);
  }
  // Método para llamar a la recomendación automática después de obtener los intereses
  llamarRecomendacionAutomatica() {
    this.api.obtenerRecomendaciones(this.intereses.PerfilObjetivoID).subscribe(
      (recomendaciones) => {
        console.log('Recomendaciones de juegos:', recomendaciones);
        // Extrae los IDs de juegos de las recomendaciones
        const juegoIds = recomendaciones.map(
          (recomendacion: any) => recomendacion.JuegoID
        );
        this.recomendaciones = recomendaciones;
        // Llama al método para obtener las calificaciones globales
        // Agrega las cualidades solo si el array está vacío
        if (this.cualidades.length === 0) {
          this.cualidades = [
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

          // Limpia los datos antiguos
          this.datosjuegos = [];
          this.calificacionesGlobales = [];
        }
        this.api.obtenerJuegosPorIds(juegoIds).subscribe(
          (juegos) => {
            // Haz algo con los datos de los juegos, por ejemplo, muestra en la consola
            console.log('Juegos obtenidos:', juegos);

              // Asigna los juegos directamente según el orden de recomendaciones
          this.datosjuegos = recomendaciones.map((recomendacion: any) => {
            const juego = juegos.find((j: any) => j.JuegoID === recomendacion.JuegoID);
            return juego;
          });
            console.log('datosjuegos:', this.datosjuegos);


            this.api.obtenerCalificacionesGlobales(juegoIds).subscribe(
              (calificacionesGlobales) => {
                console.log(
                  'Calificaciones globales de juegos recomendados:',
                  calificacionesGlobales
                );
                // Realiza acciones adicionales si es necesario
                this.calificacionesGlobales = calificacionesGlobales;
                this.actualizarDatosGrafica();
              },
              (error) => {
                console.error(
                  'Error al obtener calificaciones globales de juegos recomendados:',
                  error
                );
                // Maneja el error de manera apropiada
              }
            );
          },
          (error) => {
            // Maneja el error
            console.error('Error al obtener juegos:', error);
          }
        );
      },
      (error) => {
        console.error('Error al obtener las recomendaciones de juegos', error);
        // Maneja el error de manera apropiada
      }
    );
  }
  actualizarDatosGrafica() {
    // Verifica que divGrafica y su propiedad nativeElement estén definidos
    if (this.divGrafica && this.divGrafica.nativeElement) {
      // Limpia el contenido actual del contenedor
      this.divGrafica.nativeElement.innerHTML = '';

      // Itera sobre los juegos y sus calificaciones globales correspondientes
      this.datosjuegos.forEach((juego) => {
        const calificacionGlobal = this.calificacionesGlobales.find(
          (calificacion) => calificacion.JuegoID === juego.JuegoID
        );

        if (calificacionGlobal) {
          const barContainer = document.createElement('div');
          barContainer.classList.add('bar-container');

          Object.keys(calificacionGlobal).forEach((cualidad) => {
            if (
              cualidad !== 'calificacionglobalID' &&
              cualidad !== 'JuegoID' &&
              cualidad !== 'UsuarioID'
            ) {
              const barLabel = document.createElement('div');
              barLabel.innerText = cualidad;
              barLabel.classList.add('bar-label');

              const bar = document.createElement('div');
              bar.style.width = calificacionGlobal[cualidad] + '%';
              bar.classList.add('bar');

              barContainer.appendChild(barLabel);
              barContainer.appendChild(bar);
            }
          });

          this.divGrafica.nativeElement.appendChild(barContainer);
        }
      });
    } else {
      console.error('divGrafica o nativeElement no están definidos.');
    }
  }
  obtenerValorCualidad(juego: any, cualidad: any): number {
    const calificacionGlobal = this.calificacionesGlobales.find(
      (calificacion) => calificacion.JuegoID === juego.JuegoID
    );

    if (calificacionGlobal) {
      return calificacionGlobal[cualidad.nombre] || 0;
    }

    return 0;
  }

  inicializarDatos() {
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
}
