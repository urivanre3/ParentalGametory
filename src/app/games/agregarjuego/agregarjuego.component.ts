import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Videojuego, ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-agregarjuego',
  templateUrl: './agregarjuego.component.html',
  styleUrls: ['./agregarjuego.component.css']
})
export class AgregarjuegoComponent implements OnInit {

  videojuego: Videojuego={
    titulo:'',
    categoria:'',
    clasificacion:'',
    educatividad:'',
    descripcion:'',
    puntuacion:'',
    portadaURL:'',
   
  };



  constructor(private ApiService : ApiService, private router:Router) { }

  ngOnInit(): void {
  }

  agregar(){
    

   /*  this.ApiService.addVideogame(this.videojuego).subscribe(); */
    this.router.navigate(['/inicio']);
  }
  

}
