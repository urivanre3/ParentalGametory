import { Component, OnInit, Optional, ViewChild } from '@angular/core';
import { ApiService, Videojuego } from '../api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
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
 loggedIn: boolean = false;
  key : string ='session'

  //producto a imprimir
  videogame: any = {};
  //cantidad a comprar
  amount: number = 0;

  loadingProduct: boolean;

/*   //generacion de QR aleatorio
  urls: any[] = [];
  random: number = 0;
  flag_qr: boolean = false;
 */



  constructor( @Optional() /*private auth: Auth, */ private api: ApiService, private router: ActivatedRoute) {
    console.log('dentro de ver producto CONSTRUCTOR ');
    this.loadingProduct = true;


/*     this.random = Math.floor(Math.random() * (9 - 0)) + 0;
    console.log("Numero aleatorio == " + this.random); */




    this.router.params.subscribe((params) => {
      this.getVideogame(params['id']);
      //prueba en consola
      console.log('llego ' + params['id']);
    });

    // Auth
/*     if (auth) {
      this.user = authState(this.auth);
    } */
    if (localStorage.getItem(this.key)) {

      let data = localStorage.getItem("key");
       
        this.api.singin(data).subscribe((res:any) => {
          console.log('session this api gets');
          
          this.loggedIn = true;
        });
  
      }else{
        console.log('No data detected');      
      
    }
  }

  ngOnInit(): void {

  }

  //metodo que busca productos
  getVideogame(id: string) {
    console.log('dentro de ver producto GETPRODUCT');
    this.loadingProduct = true;

    //se obtienen los datos del producto seleccionado
    this.api.getaVideogame(id).subscribe((videogame) => {
      console.log('ver producto PRODUCT = ' + videogame);
      console.log(videogame);

      //se meten los datos de la BD a nuestra variable
      this.videogame = videogame;

      //prueba en consola
      console.log(this.videogame.title);

      this.loadingProduct = false;
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
