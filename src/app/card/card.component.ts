import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardComponent implements OnInit {

  
 // Add calificacionesGlobales as an input property
 @Input() items: { [key: string]: any, calificacionesGlobales: any }[] = [];
 @Input() calificacionesGlobales: any[] = []; // Agrega las calificaciones globales como input
 @Input() cualidadesValores: any = {}; // Agrega los valores de cualidades como input

 @Input() cualidades: any[] = []; // Add this line

 constructor(private router: Router) {}

 ngOnInit(): void {
  console.log('CardComponent initialized');
}

ngOnChanges(changes: SimpleChanges): void {
/*   if (changes['items'] && !changes['items'].firstChange) {
    console.log('CardComponent input changed', changes);
    // Your logic here
  } */
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
 trackByFn(index: number, item: any): any {
  return item.JuegoID; // o cualquier propiedad única en tu objeto item
}
}
