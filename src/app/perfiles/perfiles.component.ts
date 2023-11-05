import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-perfiles',
  templateUrl: './perfiles.component.html',
  styleUrls: ['./perfiles.component.css']
})
export class PerfilesComponent implements OnInit {


  private userSubscription: Subscription | undefined; // Para gestionar la suscripción
  loggedIn = false; // Cambiado a un valor booleano
  userData: any = null;


  constructor(private api: ApiService ) { 

    this.userSubscription = this.api.isUserAuthenticated().subscribe((authenticated: boolean) => {
      this.loggedIn = authenticated;
      if (authenticated) {
        this.api.getUserData().subscribe((userData: any) => {
          this.userData = userData; // Asigna los datos del usuario
        });
      }
    });



  }

  ngOnInit(): void {
  }

}
