import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { Router } from '@angular/router';
/* import { Color, ScaleType } from '@swimlane/ngx-charts'; */

@Component({
  selector: 'app-videogames',
  templateUrl: './videogames.component.html',
  styleUrls: ['./videogames.component.css'],
})
export class VideogamesComponent implements OnInit {
  constructor(private api: ApiService, private router: Router) {}

  calificacionesGlobales: any[] = [];

  galeria: any[] = [];
  ordencualidad: any[] = [];
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
  cualidad_orden: any;
  @ViewChild('div_Grafica', { static: false }) divGrafica!: ElementRef;

  ngOnInit(): void {
    // Llama al nuevo método para obtener la galería de juegos
    this.api.obtenerGaleriaJuegos().subscribe(
      (galeria: any) => {
        this.galeria = galeria;
        // Manipula los datos de la galería de juegos aquí
        console.log('obtener galeria de juegos = ', this.galeria);

        const juegoIds = this.galeria.map((galeria: any) => galeria.JuegoID);

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
        }

        this.api.obtenerCalificacionesGlobales(juegoIds).subscribe(
          (calificacionesGlobales) => {
            console.log(
              'Calificaciones globales de juegos ordenados:',
              calificacionesGlobales
            );
            // Realiza acciones adicionales si es necesario
            this.calificacionesGlobales = calificacionesGlobales;
            this.actualizarDatosGrafica();
          },
          (error) => {
            console.error(
              'Error al obtener calificaciones globales de juegos sin ordenar:',
              error
            );
            // Maneja el error de manera apropiada
          }
        );
      },
      (error: any) => {
        // Maneja cualquier error aquí
        console.error(error);
      }
    );
  }

  actualizarDatosGrafica() {
    // Verifica que divGrafica y su propiedad nativeElement estén definidos
    if (this.divGrafica && this.divGrafica.nativeElement) {
      // Limpia el contenido actual del contenedor
      this.divGrafica.nativeElement.innerHTML = '';

      // Itera sobre los juegos y sus calificaciones globales correspondientes
      this.galeria.forEach((juego) => {
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

  ordenarJuegosPorCualidad(event: any) {
    // Obtén el valor seleccionado del evento
    const cualidadSeleccionada = event.target.value;

    // Verifica si el valor seleccionado es un número válido
    const cualidadIndex = parseInt(cualidadSeleccionada);

    if (
      !isNaN(cualidadIndex) &&
      cualidadIndex >= 1 &&
      cualidadIndex <= this.cualidades.length
    ) {
      // Asigna la cualidad correspondiente según el índice seleccionado
      this.cualidad_orden = this.cualidades[cualidadIndex - 1].nombre;
    } else {
      // Manejar el caso donde el valor seleccionado no es un número válido
      console.error('Índice de cualidad no válido.');
    }

    if (this.cualidad_orden) {
      // Llama a la API para obtener juegos ordenados por la cualidad seleccionada
      this.api.obtenerJuegosPorCualidad(this.cualidad_orden).subscribe(
        (result: any) => {
          // Asigna los juegos según el resultado de la API
          this.ordencualidad = result;
          console.log(
            'Juegos ordenados por cualidad ',
            this.cualidad_orden,
            ' = ',
            this.ordencualidad
          );

          const juegoIds = this.ordencualidad.map(
            (ordencualidad: any) => ordencualidad.JuegoID
          );

          console.log('JuegosIDS =', juegoIds);

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
          }

          this.api.obtenerCalificacionesGlobales(juegoIds).subscribe(
            (calificacionesGlobales) => {
              console.log(
                'Calificaciones globales de juegos ordenados:',
                calificacionesGlobales
              );
              // Realiza acciones adicionales si es necesario
              this.calificacionesGlobales = calificacionesGlobales;

              // Llama al nuevo método para obtener la galería de juegos
              this.api.obtenerJuegosPorIds(juegoIds).subscribe(
                (juegos) => {
                  // Haz algo con los datos de los juegos, por ejemplo, muestra en la consola
                  console.log('Juegos obtenidos:', juegos);
               
          
                  this.galeria = this.ordencualidad.map((orden: any) => {
                    const juego = juegos.find((j: any) => j.JuegoID === orden.JuegoID);
                    return juego;
                  });
                    console.log('galeria ordenada:', this.galeria);


                },
                (error: any) => {
                  // Maneja cualquier error aquí
                  console.error(error);
                }
              );
            },
            (error) => {
              console.error(
                'Error al obtener calificaciones globales de juegos ordenados:',
                error
              );
              // Maneja el error de manera apropiada
            }
          );
        },
        (error: any) => {
          console.error('Error al obtener juegos por cualidad:', error);
          // Maneja el error de manera apropiada
        }
      );
    }
  }

  seeProduct(item: any) {
    console.log('metodo ver juego');
    let JuegoID;
    JuegoID = item.JuegoID;
    console.log('JuegoID == ' + JuegoID);
    this.router.navigate(['/videojuego', JuegoID]);
  }

  onImageError(event: any) {
    event.target.src = '/assets/ImagenError.png'; // Reemplaza con la ruta de tu imagen de error
  }
}
