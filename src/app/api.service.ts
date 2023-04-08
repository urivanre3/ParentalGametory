import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  url='/api';
  constructor(private http: HttpClient) { }


  //get videojuego
  getVideojuegos()
  {
    return this.http.get(this.url);
  }


  //get un videojuego
  getUnVideojuegos(id:string){
    return this.http.get(this.url+'/'+id);
  }


  //agregar videojuego
  addVideojuego(videojuego:Videojuego)
  {
    return this.http.post(this.url, videojuego);
  }


  //eliminar
  deleteVideojuego(id:string){
    return this.http.delete(this.url+'/'+id);
  }

  //modificar videojuego
  editVideojuego(id:string, videojuego:Videojuego){
    return this.http.put(this.url+'/'+id, videojuego);
  }

}


export interface Videojuego{
  titulo?:string;
  categoria?:string;
  clasificacion?:string;
  educatividad?:string;
  descripcion?:string;
  puntuacion?: any;
  portadaURL?:string;

}




