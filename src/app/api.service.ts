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

 // Obtiene los datos del usuario con sesión activa
 getUserData(): Observable<any | null> {
  const token = localStorage.getItem('token');
  if (this.jwtHelper.isTokenExpired(token) || !token) {
    // Si el token ha expirado o no está presente, no hay sesión activa
    return of(null);
  } else {
    // Realiza una solicitud al servidor para obtener los datos del usuario con el token
    return this._http.get(`${this.apiUrl}/getUserData`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
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



