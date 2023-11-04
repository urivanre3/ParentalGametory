import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  apiUrl = 'http://localhost:3000';

  constructor(private _http: HttpClient, private jwtHelper: JwtHelperService) { 

  }

  

 


/////////USUARIOS//////


logout(): Observable<any> {
  // Elimina el token del almacenamiento local
  localStorage.removeItem('token');

  // Aquí puedes realizar cualquier otra acción necesaria para cerrar la sesión.

  // Devuelve un observable, por ejemplo, un observable vacío.
  return new Observable(observer => {
    observer.complete(); // Emite una notificación de completado.
  });
}



//registrar un usuario nuevo
registrarUsuario(data: any): Observable<any> {
  return this._http.post(`${this.apiUrl}/registrarUsuario`, data);
}
//iniciar sesion de usuario
iniciar_sesion(data:any){    
  return this._http.post(`${this.apiUrl}/iniciarSesion`, data);
}

//Obtener token JWT para verificar sesion abierta
getToken(): string | null {
  return localStorage.getItem('token');
}
  

// En lugar de devolver un boolean, devuelve un Observable<boolean>
isUserAuthenticated(): Observable<boolean> {
  const token = localStorage.getItem('token');
  return of(!this.jwtHelper.isTokenExpired(token) && !!token);
}

isAuth():boolean{
  const token = localStorage.getItem('token');
  if(this.jwtHelper.isTokenExpired(token) || !localStorage.getItem('token')){
    return false;
  }
  return true;
}

getUserData(userId: string): Observable<any | null> {
  return this._http.get(`${this.apiUrl}/getUserData/${userId}`);
}




/////////Videojuegos//////


//obtener los videojuegos por el nombre
get_juegos_por_nombre(search: string):Observable<any> {
  return this._http.get(`${this.apiUrl}/${search}`);
}

//obtener un videojuego por id
getjuego_por_id(id:string):Observable<any> {
  return this._http.get(`${this.apiUrl}/juego/${id}`);
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



