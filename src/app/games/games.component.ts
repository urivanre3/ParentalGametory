import { Component, OnInit, Optional, ViewChild } from '@angular/core';
import { ApiService, Videojuego } from '../api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.css']
})
export class GamesComponent implements OnInit {

  // View
  @ViewChild('added')
  public readonly added!: SwalComponent;

  // Attributes
 /*  public readonly user: Observable<User | null> = EMPTY; */
 public readonly user: Observable<any | null> = EMPTY;
  loggedIn: Observable<boolean> = new Observable<boolean>();
  key : string ='session'
  idprueba!: number;

  //producto a imprimir
  juego: any = {};
  //cantidad a comprar
  amount: number = 0;

  loadingProduct: boolean;






  constructor( @Optional() /*private auth: Auth, */ private api: ApiService, private router: ActivatedRoute) {
    console.log('Games CONSTRUCTOR ');
    this.loadingProduct = true;


    this.router.params.subscribe((params) => {
      this.datos_del_juego(params['id']);
      //prueba en consola
      console.log('llego ' + params['id']);
    });
      
    // Auth
 /*    if (auth) {
      this.user = authState(this.auth);
    } */
 
  }


  isUserAuthenticated(): boolean {
    const token = localStorage.getItem('token'); // Reemplaza 'token' con el nombre correcto de tu clave en el localStorage.
  
    if (token) {
      // Si hay un token en el localStorage, verifiquemos si ha expirado o no.
      const tokenData = JSON.parse(atob(token.split('.')[1])); // Decodificamos la parte del payload del token.
  
      if (tokenData.exp) {
        // La propiedad 'exp' en el token indica la fecha de vencimiento en segundos desde 1970.
        const expirationTimestamp = tokenData.exp * 1000; // Convertimos a milisegundos.
  
        // Obtenemos la hora actual en milisegundos.
        const currentTimestamp = Date.now();
  
        // Si la fecha de vencimiento es posterior a la hora actual, el token aún no ha expirado.
        if (expirationTimestamp > currentTimestamp) {

          console.log(" GAMES.TS AUTENTIFICADO");
          return true;
          
        }
      }
    }
  
    // Si no hay token, si ha expirado o cualquier otro caso, retornamos false.

    console.log(" GAMES.TS  NO AUTENTIFICADO");
    return false;
  }


  ngOnInit(): void {
    console.log('pagina de juegos');
  }

  //metodo que busca productos
  datos_del_juego(id: string) {
    console.log('datos_del_juego');
    this.loadingProduct = true;

    //se obtienen los datos del producto seleccionado
    this.api.getjuego_por_id(id).subscribe((videogame) => {
      this.juego = videogame.data[0];
      console.log('Games getjuego_por_id = ' + this.juego.JuegoID);
      console.log('nombre de juego = ' + this.juego.NombreJuego);


      this.loadingProduct = true;
    });
  }


  //añadir productos al carrito
  async addProduct_tocart_byid(amounts: number) {
    // Get cart
/*     this.api.getVideogameList(this.auth.currentUser?.uid ?? '').subscribe((cart: any) => {
      if (cart) {
        cart.videogames.push({
          'videogame': this.videogame.id,
          'quantity': amounts,
          'price': this.videogame.price
        });
        this.api.addToVideogameList(cart).subscribe(async(result: any) => {
          await this.added.fire();
          this.amount = 0;
        });
      }
    }); */
    await this.added.fire();
  }
}
