import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit(): void {}

  @Input() items: any[] = [];

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

}
