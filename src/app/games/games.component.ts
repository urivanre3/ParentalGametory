import {
  Component,
  ElementRef,
  OnInit,
  Optional,
  ViewChild,
} from '@angular/core';
import { ApiService, Videojuego } from '../api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
/* import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';
import { ChartDataset } from 'chart.js'; */

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.css'],
})
export class GamesComponent implements OnInit {
  // View

  @ViewChild('customRange', { static: false }) customRange:
    | ElementRef
    | undefined;

  @ViewChild('rangeValue', { static: false }) rangeValue:
    | ElementRef
    | undefined;

  // Attributes
  /*  public readonly user: Observable<User | null> = EMPTY; */
  public readonly user: Observable<any | null> = EMPTY;
  loggedIn: Observable<boolean> = new Observable<boolean>();
  key: string = 'session';
  idprueba!: number;
  userIduserId: any = null;
  nombreusuario: any = null;
  //producto a imprimir
  juego: any = {};
  //cantidad a comprar
  amount: number = 0;

  loadingProduct: boolean;

  cualidades = [
    { id: 1, nombre: 'Humanidades y Emociones' },
    { id: 2, nombre: 'Historica' },
    { id: 3, nombre: 'Cultural' },
    { id: 4, nombre: 'Aritmetica' },
    { id: 5, nombre: 'Logica' },
    { id: 6, nombre: 'Accesibilidad' },
    { id: 7, nombre: 'Creatividad' },
    { id: 8, nombre: 'Lectura y Lenguaje' },
    // Agrega las otras cualidades aquí
  ];

  cualidadesValores: CualidadesValores = {
    valor1: 0,
    valor2: 0,
    valor3: 0,
    valor4: 0,
    valor5: 0,
    valor6: 0,
    valor7: 0,
    valor8: 0,
    // Añade los valores iniciales para las otras cualidades según sea necesario
  };

  juegoId: any;
  calificacionesAdmin: any[] = [];
  comentarios: any[] = [];
  constructor(
    @Optional() /*private auth: Auth, */ private api: ApiService,
    private router: ActivatedRoute,
    private el: ElementRef
  ) {
    console.log('Games CONSTRUCTOR ');
    this.loadingProduct = true;

    this.router.params.subscribe((params) => {
      this.datos_del_juego(params['id']);
      this.juegoId = params['id'];
      console.log('llego ' + this.juegoId);

      this.api.obtenerComentariosPorJuego(this.juegoId).subscribe(     
        (comentariodata) => {

        this.comentarios = comentariodata;
        console.log('comentarios = :', this.comentarios);
        //aqui va la logica de mostrar los comentarios
   
      },
      (error) => {
        console.error('Error al obtener los comentarios:', error);
      }
      );

      // Llamada al nuevo método para obtener calificación admin
      this.api.obtenerCalificacionAdmin(this.juegoId).subscribe(
        (calificacionAdmin) => {
          this.calificacionesAdmin = calificacionAdmin;
          console.log('Calificación admin:', this.calificacionesAdmin);
          // Puedes manejar la calificación admin aquí según tus necesidades

          this.api.obtenerCalificacionGlobal(this.juegoId).subscribe(
            (calificacionesGlobales) => {
              console.log('Calificaciones globales:', calificacionesGlobales);
              this.calificacionesGlobales = calificacionesGlobales;
              
             
    
              this.actualizarDatosGrafica();
            },
            (error) => {
              console.error('Error al obtener las calificaciones globales:', error);
            }
          );



        },
        (error) => {
          console.error('Error al obtener la calificación admin:', error);
          // Manejar el error según tus necesidades
        }
      );


    });

    this.api.getUserData().subscribe(
      (userData) => {
        // Verifica si userData contiene el ID del usuario
        if (userData && userData.UsuarioID) {
          this.nombreusuario = userData.NombreUsuario;
          this.userIduserId = userData.UsuarioID;

          // Obtén las calificaciones para el usuario y el juego específicos
          this.api
            .obtenerCalificaciones(this.userIduserId, this.juegoId)
            .subscribe((calificaciones: any[]) => {
              console.log('Datos de calificaciones obtenidos:', calificaciones);

              // Verifica si hay datos de interés y toma el primer elemento (el objeto de calificaciones)
              const primerElemento =
                calificaciones.length > 0 ? calificaciones[0] : null;

              // Update the values for each quality
              for (const cualidad of this.cualidades) {
                const cualidadID = cualidad.id;
                const valorKey = 'valor' + cualidadID;

                // Accede al objeto de calificaciones y luego obtén el valor por nombre
                this.cualidadesValores[valorKey] = primerElemento
                  ? parseFloat(primerElemento[cualidad.nombre])
                  : 0;
              }
              /* this.barChartData = [{ data: [], label: 'Calificaciones Globales' }]; */
            });
        } else {
          console.error(
            'ID del usuario no encontrado en los datos del usuario.'
          );
        }
      },
      (error) => {
        console.error('Error al obtener datos del usuario', error);
      }
    );
  }

  calificacionesGlobales: any[] = [];
  @ViewChild('div_Grafica', { static: false }) divGrafica!: ElementRef;
  @ViewChild('div_Grafica_admin', { static: false }) divGraficaAdmin!: ElementRef;

  ngAfterViewInit() {
    /*     this.actualizarDatosGrafica(); */
  }

  actualizarDatosGrafica() {

    console.log('prueba Calificaciones globales:', this.calificacionesGlobales);
    console.log('prueba Calificaciones admin:', this.calificacionesAdmin);
  
    // Lógica para obtener y procesar los datos de calificaciones globales

    // Verifica que divGrafica y su propiedad nativeElement estén definidos
    if (this.divGrafica && this.divGrafica.nativeElement) {
      // Limpia el contenido actual del contenedor
      this.divGrafica.nativeElement.innerHTML = '';

      // Itera sobre los datos y crea barras
      this.calificacionesGlobales.forEach((calificacion) => {
        const barContainer = document.createElement('div');
        barContainer.classList.add('bar-container');

        Object.keys(calificacion).forEach((cualidad) => {
          if (cualidad !== 'calificacionglobalID' && cualidad !== 'JuegoID') {
            const barLabel = document.createElement('div');
            barLabel.innerText = cualidad;
            barLabel.classList.add('bar-label');

            const bar = document.createElement('div');
            bar.style.width = calificacion[cualidad] + '%';
            bar.classList.add('bar');

            barContainer.appendChild(barLabel);
            barContainer.appendChild(bar);
          }
        });
        console.log('Elemento creado para valoración global:', barContainer);
        this.divGrafica.nativeElement.appendChild(barContainer);
      });

      // Llamada al nuevo método para obtener calificación admin
    } else {
      console.error('divGrafica o nativeElement no están definidos.');
    }



    

  }

  isUserAuthenticated(): boolean {
    /*     const token = localStorage.getItem('token'); // Reemplaza 'token' con el nombre correcto de tu clave en el localStorage.
  
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

    console.log(" GAMES.TS  NO AUTENTIFICADO"); */
    return false;
  }

  ngOnInit(): void {
    console.log('pagina de juegos');

    /*     this.createChart(); */
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
  }

  actualizarCalificacion() {
    // Asegúrate de que this.userIduserId, this.cualidadesValores y this.juegoId estén definidos
    if (this.userIduserId && this.cualidadesValores && this.juegoId) {
      // Imprimir datos antes de la llamada al método de la API
      console.log('ID del usuario:', this.userIduserId);
      console.log('ID del juego:', this.juegoId);
      console.log('Valores de cualidades:', this.cualidadesValores);

      // Llama a la función de actualización de calificación en ApiService
      this.api
        .actualizarCalificacion(this.userIduserId, {
          ...this.cualidadesValores,
          JuegoID: this.juegoId, // Asegúrate de incluir el ID del juego en los datos de calificación
        })
        .subscribe(
          (response) => {
            // Manejar la respuesta exitosa si es necesario
            console.log('Calificación actualizada con éxito', response);
          },
          (error) => {
            // Manejar el error si es necesario
            console.error('Error al actualizar la calificación', error);
          }
        );
    } else {
      console.error(
        'ID del usuario, ID del juego o valores de cualidades no disponibles.'
      );
    }
  }

  actualizarValorRango(event: any, idCualidad: number) {
    const target = event.target as HTMLInputElement;
    if (target && this.customRange) {
      const valor = parseFloat(target.value);
      if (!isNaN(valor)) {
        this.cualidadesValores['valor' + idCualidad] = valor;
        console.log('Prueba valores = ', this.cualidadesValores); // Imprime los valores en la consola
        this.customRange.nativeElement.style.setProperty(
          '--value',
          (valor - parseFloat(this.customRange.nativeElement.min)) /
            (parseFloat(this.customRange.nativeElement.max) -
              parseFloat(this.customRange.nativeElement.min))
        );
      }
    }
  }

  obtenerValorCualidad(cualidad: any): number {
    const calificacionGlobal = this.calificacionesGlobales[0]; // Supongo que solo hay un objeto en calificacionesGlobales

    if (calificacionGlobal) {
      return calificacionGlobal[cualidad.nombre] || 0;
    }

    return 0;
  }

/*   obtenerValorCualidadAdmin(cualidad: any): number {
    const calificacionGlobalAdmin = this.calificacionesAdmin[0]; // Supongo que solo hay un objeto en calificacionesGlobales

    if (calificacionGlobalAdmin) {
      console.log('if (calificacionGlobalAdmin = ', calificacionGlobalAdmin); // Imprime los valores en la consola
      return calificacionGlobalAdmin[cualidad.nombre] || 0;
    }

    return 0;
  
  
  }
 */

// Dentro de tu componente
valorAdmin: number = 0; // Variable para almacenar el valor aleatorio

  obtenerValorCualidadAdmin(cualidad: any): number {
    // Devuelve un valor aleatorio entre 0 y 100 y almacénalo en una variable
    this.valorAdmin = Math.floor(Math.random() * 101);
    return this.valorAdmin;
  }

  nuevoComentario: string = '';
  agregarComentario() {

    console.log('Agregando comentario:', this.nuevoComentario);

    // Resto del código...
  

    // Verifica que el nuevo comentario no esté vacío
    if (this.nuevoComentario.trim() !== '') {
      const nuevoComentario = {
        UsuarioID: this.userIduserId, // Supongo que ya tienes el ID del usuario
        JuegoID: this.juegoId,
        nombre: this.nombreusuario,
        ContenidoComentario: this.nuevoComentario,
        FechaComentario: new Date().toISOString(), // O ajusta a tu formato de fecha
      };
      console.log('Comentario insertado exitosamente', nuevoComentario);
      // Llama al servicio para insertar el nuevo comentario
      this.api.insertarComentario(nuevoComentario).subscribe(
        (response) => {
          console.log('Comentario insertado exitosamente', response);

          // Actualiza la lista de comentarios después de la inserción exitosa
          this.api.obtenerComentariosPorJuego(this.juegoId).subscribe(
            (comentarios) => {
              this.comentarios = comentarios;
            },
            (error) => {
              console.error('Error al obtener comentarios:', error);
            }
          );
          console.log('Nuevo comentario insertado:', response);
          // Limpia el campo del nuevo comentario
          this.nuevoComentario = '';
        },
        (error) => {
          console.error('Error al insertar comentario:', error);
        }
      );
    }
  }



}

interface CualidadesValores {
  [key: string]: number;
  valor1: number;
  valor2: number;
  valor3: number;
  valor4: number;
  valor5: number;
  valor6: number;
  valor7: number;
  valor8: number;
  // Agrega las propiedades para las otras cualidades según sea necesario
}
