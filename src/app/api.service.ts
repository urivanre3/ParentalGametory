import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  apiUrl = 'http://localhost:3000';

  constructor(private _http: HttpClient, private jwtHelper: JwtHelperService) { 

  }

 
  isAuth():boolean{
    const token = localStorage.getItem('token');
    if(this.jwtHelper.isTokenExpired(token) || !localStorage.getItem('token')){
      return false;
    }
    return true;
  }

  /////Videogame/////

  //obtener un videojuego por id
  getaVideogame(id:string):Observable<any> {
    return this._http.get(`${this.apiUrl}/Videogame/${id}`);
  }
  
  //obtener los videojuegos por el nombre
  getVideogames_by_name(search: string):Observable<any> {
    return this._http.get(`${this.apiUrl}/${search}`);
  }


  //agregar videojuego
  addVideogame(videojuego:Videojuego)
  {
    return this._http.post(`${this.apiUrl}/AddVideogame`, videojuego);
  }

  //Get all data
  getAllData():Observable<any>{
    return this._http.get(`${this.apiUrl}`);
  }

  //////
  ////USERS/////
  getSingleUser(id: number):Observable<any>{
    return this._http.get(`${this.apiUrl}/${id}`);
  }
   
  singin(data:any){    
    return this._http.post(`${this.apiUrl}/UserbyData`, data);
  }

  //crear un nuevo usuario
  addCustomer(data:any): Observable<any>{
    return this._http.post(`${this.apiUrl}/addcustomer`, data);
  }
  
  //obtener la lista de videojuegos de un usuario
  getVideogameList(id:any): Observable<any>{
    return this._http.get(`${this.apiUrl}/${id}`);
  }
  
  //Añadir un videjuego a la lista del usuario
  addToVideogameList(list:any): Observable<any>{
    return this._http.post(`${this.apiUrl}`, list);
  }

  //Edit User
  editUser(id: number, value: any): Observable<Object> {
    return this._http.put(`${this.apiUrl}/${id}`, value);
  }
  
  //Delete User
  deleteUser(id: number): Observable<any> {
    return this._http.delete(`${this.apiUrl}/${id}`);
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



/* 

  //get videojuego
  getVideogames()
  {
    return this._http.get(this.url);
  }

  //obtener un videojuego por id
  //get un videojuego
  getaVideogame(id:string){
    return this._http.get(this.url+'/'+id);
  }



  //agregar videojuego
  addVideogame(videojuego:Videojuego)
  {
    return this._http.post(this.url, videojuego);
  }


  //eliminar
  deleteVideojuego(id:string){
    return this._http.delete(this.url+'/'+id);
  }

  //modificar videojuego
  editVideojuego(id:string, videojuego:Videojuego){
    return this._http.put(this.url+'/'+id, videojuego);
  }
 */

