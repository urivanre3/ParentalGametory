import { Injectable } from '@angular/core';
import { Observable, catchError, map, mergeMap, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  apiUrl = 'http://localhost:3000';

  constructor(private _http: HttpClient, private jwtHelper: JwtHelperService) {}

  ///////// PERFILES //////////

  buscarPerfiles(userId: string): Observable<any> {
    // Realiza una solicitud al servidor para buscar perfiles relacionados al usuario
    return this._http.get(`${this.apiUrl}/buscarPerfiles/${userId}`, {
      headers: {
        Authorization: `Bearer ${this.getToken()}`, // Agrega el token de autenticación si es necesario
      },
    });
  }

  crearPerfiles(data: any): Observable<any> {
    return this._http.post(`${this.apiUrl}/crearPerfiles`, data);
  }

  // Método en la clase ApiService
  actualizarPerfil(perfilId: string, nuevoPerfil: any): Observable<any> {
    return this._http.put(
      `${this.apiUrl}/actualizarPerfil/${perfilId}`,
      nuevoPerfil,
      {
        headers: {
          Authorization: `Bearer ${this.getToken()}`,
        },
      }
    );
  }

  ////////////////INTERESES///////////////

  crearInteres(data: any): Observable<any> {
    return this._http.post(`${this.apiUrl}/crearInteres`, data);
  }

  obtenerInteres(perfilId: string): Observable<any> {
    return this._http.get(`${this.apiUrl}/obtenerInteres/${perfilId}`, {
      headers: {
        Authorization: `Bearer ${this.getToken()}`,
      },
    });
  }

  actualizarInteres(
    perfilId: string,
    nuevosDatosInteres: any
  ): Observable<any> {
    return this._http.put(
      `${this.apiUrl}/actualizarInteres/${perfilId}`,
      nuevosDatosInteres,
      {
        headers: {
          Authorization: `Bearer ${this.getToken()}`,
        },
      }
    );
  }

  borrarPerfilEInteres(perfilId: number): Observable<any> {
    const url = `${this.apiUrl}/borrarPerfilEInteres/${perfilId}`;
    return this._http.delete(url);
  }

  ///////// USUARIOS //////////

  logout(): Observable<any> {
    const token = localStorage.getItem('token');

    // Si no hay token en el almacenamiento local, emite una notificación de completado.
    if (!token) {
      return new Observable((observer) => {
        observer.complete();
      });
    }

    // Realiza una solicitud al servidor para cerrar la sesión.
    return this._http.post(`${this.apiUrl}/logout`, {}).pipe(
      map(() => {
        // Después de cerrar la sesión en el servidor, elimina el token del almacenamiento local.
        localStorage.removeItem('token');
        return null; // Puedes emitir cualquier valor que desees aquí.
      })
    );
  }

  //registrar un usuario nuevo
  registrarUsuario(data: any): Observable<any> {
    return this._http.post(`${this.apiUrl}/registrarUsuario`, data);
  }
  //iniciar sesion de usuario
  iniciar_sesion(data: any) {
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

  isAuth(): boolean {
    const token = localStorage.getItem('token');
    if (
      this.jwtHelper.isTokenExpired(token) ||
      !localStorage.getItem('token')
    ) {
      return false;
    }
    return true;
  }

  getUserData(): Observable<any | null> {
    const token = localStorage.getItem('token');
    if (this.jwtHelper.isTokenExpired(token) || !token) {
      // Si el token ha expirado o no está presente, no hay sesión activa
      return of(null);
    } else {
      // Realiza una solicitud al servidor para obtener los datos del usuario con el token
      return this._http
        .get(`${this.apiUrl}/getUserData`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .pipe(
          map((userData: any) => {
            return userData; // Devuelve los datos del usuario
          })
        );
    }
  }

  actualizarUltimoPerfil(
    userId: string,
    nuevoUltimoPerfilId: string
  ): Observable<any> {
    return this._http.put(
      `${this.apiUrl}/actualizarUltimoPerfil/${userId}`,
      { ultimoPerfilId: nuevoUltimoPerfilId },
      {
        headers: {
          Authorization: `Bearer ${this.getToken()}`,
        },
      }
    );
  }

  obtenerUltimoPerfil(userId: string): Observable<any> {
    const url = `${this.apiUrl}/obtenerUltimoPerfil/${userId}`;
    const token = this.getToken();

    if (!token) {
      // Manejar la ausencia de token según tus necesidades
      return throwError('No se proporcionó un token.');
    }

    return this._http
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .pipe(
        catchError((error) => {
          // Manejar errores aquí
          console.error('Error en la solicitud obtenerUltimoPerfil:', error);
          return throwError('Error en la solicitud obtenerUltimoPerfil.');
        })
      );
  }
  /////////Videojuegos//////

  //obtener los videojuegos por el nombre
  get_juegos_por_nombre(search: string): Observable<any> {
    return this._http.get(`${this.apiUrl}/${search}`);
  }

  //obtener un videojuego por id
  getjuego_por_id(id: string): Observable<any> {
    return this._http.get(`${this.apiUrl}/juego/${id}`);
  }

  /////////calificaciones///////////////

  // Método para actualizar calificaciones
  actualizarCalificacion(
    userId: string,
    nuevosDatosCalificacion: any
  ): Observable<any> {
    const juegoId =
      nuevosDatosCalificacion && nuevosDatosCalificacion.JuegoID
        ? nuevosDatosCalificacion.JuegoID
        : '';

    // Verificar si el juegoId está definido
    if (!juegoId) {
      return throwError('ID del juego no proporcionado');
    }

    // Verificar y reemplazar valores nulos con un valor predeterminado
    Object.keys(nuevosDatosCalificacion).forEach((key) => {
      if (nuevosDatosCalificacion[key] === null) {
        nuevosDatosCalificacion[key] = 'valor_predeterminado'; // Cambia esto según tus necesidades
      }
    });

    const url = `${this.apiUrl}/actualizarCalificacion/${userId}`;

    // Configura los encabezados de la solicitud con el token de autenticación
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });

    // Realiza una solicitud para actualizar la calificación
    return this._http.put(url, nuevosDatosCalificacion, { headers });
  } 

  obtenerCalificaciones(userId: string, juegoId: string): Observable<any> {
    const url = `${this.apiUrl}/obtenerCalificaciones/${userId}/${juegoId}`;
  
    return this._http.get(url, {
      headers: {
        Authorization: `Bearer ${this.getToken()}`,
      },
    });
  }


  
  //////////// CALIFICACIONES GLOBALES ///////////////

  obtenerCalificacionGlobal(juegoId: string): Observable<any> {
    const url = `${this.apiUrl}/obtenerCalificacionGlobal/${juegoId}`;
  
    // Configura los encabezados de la solicitud con el token de autenticación si es necesario
    const headers = this.getToken()
      ? new HttpHeaders({
          Authorization: `Bearer ${this.getToken()}`,
        })
      : undefined;  // Cambiado de null a undefined
  
    // Realiza una solicitud para obtener las calificaciones globales
    return this._http.get(url, { headers });
  }

}

export interface Videojuego {
  titulo?: string;
  categoria?: string;
  clasificacion?: string;
  educatividad?: string;
  descripcion?: string;
  puntuacion?: any;
  portadaURL?: string;
}
