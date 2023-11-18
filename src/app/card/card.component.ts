import { Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardComponent implements OnInit {

  constructor(private router: Router, private api: ApiService) {}

  ngOnInit(): void {

    this.obtenerCalificacionesGlobales();
  }



  @Input() items: any[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items'] && !changes['items'].firstChange) {
      // Solo vuelve a obtener las calificaciones globales si el arreglo 'items' cambió
      this.obtenerCalificacionesGlobales();
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

  showCard(item: any) {
    console.log('Metodo mostrar card component');
    console.log(item);
    return item;
  }

  calificacionesGlobales: any[] = [];
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
  obtenerCalificacionesGlobales() {
    const juegoIds = this.items.map((item) => item.JuegoID);
  
    this.api.obtenerCalificacionesGlobales(juegoIds).subscribe(
      (calificacionesGlobales) => {
        console.log('Calificaciones globales de juegos:', calificacionesGlobales);
        this.calificacionesGlobales = calificacionesGlobales;
      },
      (error) => {
        console.error('Error al obtener calificaciones globales de juegos:', error);
        // Maneja el error de manera apropiada
      }
    );
  }
  // Método para obtener el valor de una cualidad específica
  obtenerValorCualidad(juego: any, cualidad: any): number {
    const calificacionGlobal = this.calificacionesGlobales.find(
      (calificacion) => calificacion.JuegoID === juego.JuegoID
    );

    if (calificacionGlobal && calificacionGlobal[cualidad.nombre]) {
      return calificacionGlobal[cualidad.nombre];
    }

    return 0;
  }

  trackByFn(index: number, item: any): any {
    return item.JuegoID; // Cambia esto a la propiedad única que identifica cada elemento
  }



  


}
