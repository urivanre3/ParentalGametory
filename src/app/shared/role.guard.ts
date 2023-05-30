import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import decode from 'jwt-decode';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: ApiService,
    public router: Router
  ){ }
  canActivate(route: ActivatedRouteSnapshot):boolean{
    const expectedRole = route.data['expectedRole'];
    const token = localStorage.getItem('token') || "[]";

    const decoded : any  = decode(token);
    console.log(decoded.idusuario);  
    console.log(decoded.nombre);


    if( !this.authService.isAuth() || decoded.admin !== expectedRole){
      console.log('Usuario no autorizado para la vista');
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }
  
}
