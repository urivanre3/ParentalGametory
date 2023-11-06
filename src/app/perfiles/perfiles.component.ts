import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
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
  datosusuario: any = null;
  perfiles: any = null;
  perfilSeleccionado: any = null;
  default= true;
  mostrarAgregar = false; // Mostrar el div de Agregar Perfil por defecto
  mostrarActualizar = false;
  mostrarBorrar = false;



  constructor(private api: ApiService , private renderer: Renderer2, private el: ElementRef ) { 

    this.userSubscription = this.api.isUserAuthenticated().subscribe((authenticated: boolean) => {
      this.loggedIn = authenticated;
      if (authenticated) {
        this.api.getUserData().subscribe((respuestausuario: any) => {

          this.datosusuario = respuestausuario; // Asigna los datos del usuario

          console.log("Nombre de usuario: " + this.datosusuario.NombreUsuario);
          console.log("Correo electrónico: " + this.datosusuario.CorreoElectronico);
          console.log("Número de id: " + this.datosusuario.UsuarioID);
          this.api.buscarPerfiles(this.datosusuario.UsuarioID).subscribe((respuesta: any) => {

            if (respuesta && respuesta.length > 0) {

              // profiles es la respuesta con los perfiles relacionados
              this.perfiles = respuesta;

              for (const perfil of this.perfiles) {
                console.log("Perfiles id: ", perfil.PerfilObjetivoID);
                console.log("Perfiles NombreObjetivo: ", perfil.NombreObjetivo);
                console.log("Perfiles Edad del objetivo: ", perfil.EdadObjetivo);
                console.log("Perfiles Genero del objetivo: ", perfil.GeneroObjetivo);
              }
            } else {
              console.log("Este usuario no tiene perfiles a vinculados:");
            }





          });

        });
      }
    });



  }

    // Agrega una función para manejar la selección de un perfil
    seleccionarPerfil(perfil: any) {
      this.perfilSeleccionado = perfil;

      console.log("Seleccionado id: ", this.perfilSeleccionado.PerfilObjetivoID);
      console.log("Seleccionado NombreObjetivo: ", this.perfilSeleccionado.NombreObjetivo);
      console.log("Seleccionado Edad del objetivo: ", this.perfilSeleccionado.EdadObjetivo);
      console.log("Seleccionado Genero del objetivo: ", this.perfilSeleccionado.GeneroObjetivo);
    }

  ngOnInit(): void {
  }

  // Funciones para mostrar u ocultar los divs según el botón seleccionado
  mostrarAgregarPerfil() {
    this.default = false;
    this.mostrarAgregar = true;
    this.mostrarActualizar = false;
    this.mostrarBorrar = false;
  }

  mostrarActualizarPerfil() {
    this.default = false;
    this.mostrarAgregar = false;
    this.mostrarActualizar = true;
    this.mostrarBorrar = false;
  }

  mostrarBorrarPerfil() {
    this.default = false;
    this.mostrarAgregar = false;
    this.mostrarActualizar = false;
    this.mostrarBorrar = true;
  }

  nuevoPerfil = {
    nombre: '',
    edad: null,
    genero: ''
  };


  agregarPerfil() {
    // Aquí debes enviar los datos del nuevo perfil al servidor o realizar la lógica necesaria
    console.log('Datos del nuevo perfil:', this.nuevoPerfil);
  
    // Puedes restablecer el objeto nuevoPerfil después de agregarlo si es necesario
    this.nuevoPerfil = {
      nombre: '',
      edad: null,
      genero: ''
    };
  }

   // Función para actualizar el valor y el color del rango
   actualizarValorRango(event: Event) {
    const target = event.target as HTMLInputElement; // Aseguramos que el objetivo sea un elemento de entrada HTML
    if (target) {
      const valor = parseFloat(target.value);
      if (!isNaN(valor)) {
        const range = this.el.nativeElement.querySelector('#customRange3');
        const rangeValue = this.el.nativeElement.querySelector('#rangeValue');
        range.style.setProperty('--value', (valor - parseFloat(range.min)) / (parseFloat(range.max) - parseFloat(range.min)));
        rangeValue.innerText = valor.toString();
      }
    }
  }



}
