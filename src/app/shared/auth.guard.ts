import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from '../api.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private api: ApiService,
    private router: Router
  ) {  }


/*   canActivate():boolean{

    if(!this.authService.isAuth()){
      console.log('Token no es válido o ya expiró');
      this.router.navigate(['login']);
      return false;
    }
    return true;
  } */


 /*  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.auth.isLoggedIn) {
      this.router.navigate(['/']);
      return false;
    } else {
      return true;
    } */

    canActivate(): boolean {
      const token = this.api.getToken();
  
      if (token) {
        const jwtHelper = new JwtHelperService();
  
        if (!jwtHelper.isTokenExpired(token)) {
          // El token es válido y no ha expirado.
          return true;
        }
      }
  
      // Si no hay un token válido o ha expirado, redirige al usuario a la página de inicio de sesión.
      this.router.navigate(['/home']);
      return false;
    }

  
}
