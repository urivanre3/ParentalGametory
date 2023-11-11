import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { ApiService } from '../api.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfiles',
  templateUrl: './perfiles.component.html',
  styleUrls: ['./perfiles.component.css'],
})
export class PerfilesComponent implements OnInit {
  private userSubscription: Subscription | undefined; // Para gestionar la suscripción
  loggedIn = false; // Cambiado a un valor booleano
  datosusuario: any = null;
  perfiles: any = null;
  perfilSeleccionado: any = null;
  default = true;
  mostrarAgregar = false; // Mostrar el div de Agregar Perfil por defecto
  mostrarActualizar = false;
  mostrarBorrar = false;
  perfilAActualizar: any = null;

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

  constructor(
    private api: ApiService,
    private renderer: Renderer2,
    private el: ElementRef,
    private router: Router
  ) {
    this.userSubscription = this.api
      .isUserAuthenticated()
      .subscribe((authenticated: boolean) => {
        this.loggedIn = authenticated;
        if (authenticated) {
          this.api.getUserData().subscribe((respuestausuario: any) => {
            this.datosusuario = respuestausuario; // Asigna los datos del usuario

            console.log(
              'Nombre de usuario: ' + this.datosusuario.NombreUsuario
            );
            console.log(
              'Correo electrónico: ' + this.datosusuario.CorreoElectronico
            );
            console.log('Número de id: ' + this.datosusuario.UsuarioID);

            this.nuevoPerfil.usid_perfil = this.datosusuario.UsuarioID;
            this.api
              .buscarPerfiles(this.datosusuario.UsuarioID)
              .subscribe((respuesta: any) => {
                if (respuesta && respuesta.length > 0) {
                  // profiles es la respuesta con los perfiles relacionados
                  this.perfiles = respuesta;

                  for (const perfil of this.perfiles) {
                    console.log('Perfiles id: ', perfil.PerfilObjetivoID);
                    console.log(
                      'Perfiles NombreObjetivo: ',
                      perfil.NombreObjetivo
                    );
                    console.log(
                      'Perfiles Edad del objetivo: ',
                      perfil.EdadObjetivo
                    );
                    console.log(
                      'Perfiles Genero del objetivo: ',
                      perfil.GeneroObjetivo
                    );
                  }
                } else {
                  console.log('Este usuario no tiene perfiles a vinculados:');
                }
              });
          });
        }
      });
  }

  // Agrega una función para manejar la selección de un perfil
  seleccionarPerfil(perfil: any) {
    this.perfilSeleccionado = perfil;

    console.log('Seleccionado id: ', this.perfilSeleccionado.PerfilObjetivoID);
    console.log(
      'Seleccionado NombreObjetivo: ',
      this.perfilSeleccionado.NombreObjetivo
    );
    console.log(
      'Seleccionado Edad del objetivo: ',
      this.perfilSeleccionado.EdadObjetivo
    );
    console.log(
      'Seleccionado Genero del objetivo: ',
      this.perfilSeleccionado.GeneroObjetivo
    );

    this.api
      .actualizarUltimoPerfil(
        this.datosusuario.UsuarioID,
        this.perfilSeleccionado.PerfilObjetivoID
      )
      .subscribe(
        (response) => {
          console.log('Campo UltimoPerfil actualizado con éxito:', response);
        },
        (error) => {
          console.error('Error al actualizar el campo UltimoPerfil:', error);
        }
      );
  }

  ngOnInit(): void {}

  // Funciones para mostrar u ocultar los divs según el botón seleccionado
  mostrarAgregarPerfil() {
    this.default = false;
    this.mostrarAgregar = true;
    this.mostrarActualizar = false;
    this.mostrarBorrar = false;
  }

  // Function to update a profile
  actualizarPerfil() {
    if (!this.perfilAActualizar || !this.perfilAActualizar.PerfilObjetivoID) {
      console.error('No profile selected for update.');
      return;
    }

    // Preparar los nuevos datos del perfil
    const nuevosDatosPerfil = {
      nombre: this.nuevoPerfil.nombre,
      edad: this.nuevoPerfil.edad,
      genero: this.nuevoPerfil.genero,
    };

    console.log('Datos del perfil a actualizar:', nuevosDatosPerfil);

    // Actualizar el perfil
    this.api
      .actualizarPerfil(
        this.perfilAActualizar.PerfilObjetivoID,
        nuevosDatosPerfil
      )
      .subscribe(() => {
        console.log('Profile updated successfully.');
        // Actualizar la lista de perfiles después de la actualización
        this.actualizarListaPerfiles();

        // Obtener los nuevos datos de interés del formulario
        const nuevosDatosInteres = {
          valor1: this.cualidadesValores.valor1,
          valor2: this.cualidadesValores.valor2,
          valor3: this.cualidadesValores.valor3,
          valor4: this.cualidadesValores.valor4,
          valor5: this.cualidadesValores.valor5,
          valor6: this.cualidadesValores.valor6,
          valor7: this.cualidadesValores.valor7,
          valor8: this.cualidadesValores.valor8,
        };

        console.log('Datos del interés a actualizar:', nuevosDatosInteres);

        // Actualizar el interés asociado al perfil
        this.api
          .actualizarInteres(
            this.perfilAActualizar.PerfilObjetivoID,
            nuevosDatosInteres
          )
          .subscribe(() => {
            console.log('Interest updated successfully.');
            // Redirigir a la página de perfiles
            this.redirigirAperfiles();
          });
      });
  }

  // Función para redirigir a la página de perfiles
  redirigirAperfiles() {
    console.log('Redireccionando a la página de perfiles...');
    // Restablecer las banderas booleanas
    this.default = true;
    this.mostrarAgregar = false;
    this.mostrarActualizar = false;
    this.mostrarBorrar = false;

    // Limpiar los datos de nuevo perfil y cualidades
    this.nuevoPerfil = {
      usid_perfil: null,
      nombre: '',
      edad: null,
      genero: '',
    };
    this.cualidadesValores = {
      valor1: 0,
      valor2: 0,
      valor3: 0,
      valor4: 0,
      valor5: 0,
      valor6: 0,
      valor7: 0,
      valor8: 0,
    };

    // Redirige a la página de perfiles
    this.router.navigate(['/perfiles']);
  }

  // Function to show the update profile form
  mostrarActualizarPerfil() {
    this.default = false;
    this.mostrarAgregar = false;
    this.mostrarActualizar = true;
    this.mostrarBorrar = false;

    this.api
      .obtenerInteres(this.perfilSeleccionado.PerfilObjetivoID)
      .subscribe((datosInteres: any[]) => {
        console.log('Datos de interés obtenidos:', datosInteres);

        // Verifica si hay datos de interés y toma el primer elemento (el objeto de cualidades)
        const primerElemento = datosInteres.length > 0 ? datosInteres[0] : null;

        // Set the profile to be updated
        this.perfilAActualizar = this.perfilSeleccionado;

        // Populate the form fields with the data of the selected profile
        this.nuevoPerfil = {
          usid_perfil: this.datosusuario.UsuarioID,
          nombre: this.perfilAActualizar.NombreObjetivo,
          edad: this.perfilAActualizar.EdadObjetivo,
          genero: this.perfilAActualizar.GeneroObjetivo,
        };

        // Update the values for each quality
        for (const cualidad of this.cualidades) {
          const cualidadID = cualidad.id;
          const valorKey = 'valor' + cualidadID;

          // Accede al objeto de cualidades y luego obtén el valor por nombre
          this.cualidadesValores[valorKey] = primerElemento
            ? parseFloat(primerElemento[cualidad.nombre])
            : 0;
        }
      });
  }
  // Function to refresh the list of profiles
  actualizarListaPerfiles() {
    this.api
      .buscarPerfiles(this.datosusuario.UsuarioID)
      .subscribe((respuesta: any) => {
        if (respuesta && respuesta.length > 0) {
          this.perfiles = respuesta;
        } else {
          console.log('Este usuario no tiene perfiles vinculados.');
        }
      });
  }

  mostrarBorrarPerfil() {
    this.default = false;
    this.mostrarAgregar = false;
    this.mostrarActualizar = false;
    this.mostrarBorrar = true;
  }

  nuevoPerfil = {
    usid_perfil: null,
    nombre: '',
    edad: null,
    genero: '',
  };

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

  agregarPerfil() {
    // Aquí debes enviar los datos del nuevo perfil al servidor o realizar la lógica necesaria
    console.log('Datos del nuevo perfil:', this.nuevoPerfil);
  
    const valoresTemp = {
      PerfilObjID: null,
      valor1: this.cualidadesValores.valor1,
      valor2: this.cualidadesValores.valor2,
      valor3: this.cualidadesValores.valor3,
      valor4: this.cualidadesValores.valor4,
      valor5: this.cualidadesValores.valor5,
      valor6: this.cualidadesValores.valor6,
      valor7: this.cualidadesValores.valor7,
      valor8: this.cualidadesValores.valor8,
      // Añade las demás propiedades según sea necesario
    };
  
    // Crea el nuevo perfil
    this.api.crearPerfiles(this.nuevoPerfil).subscribe((resultado: any) => {
      console.log('Perfil creado con ID:', resultado.PerfilObjetivoID);
      valoresTemp.PerfilObjID = resultado.PerfilObjetivoID;
  
      console.log('Datos del nuevo Interes:', valoresTemp);
      // Crea una nueva preferencia asociada al perfil creado
      this.api.crearInteres(valoresTemp).subscribe(() => {
        console.log('Interes creado exitosamente');
  
        // Actualiza la lista de perfiles después de la creación exitosa
        this.actualizarListaPerfiles();
  
        // Redirige a la página de perfiles después de completar la creación
        this.redirigirAperfiles();
      });
    });
  }

  // Función para actualizar el valor y el color del rango
  actualizarValorRango(event: any, idCualidad: number) {
    const target = event.target as HTMLInputElement;
    if (target) {
      const valor = parseFloat(target.value);
      if (!isNaN(valor)) {
        const range = this.el.nativeElement.querySelector(
          `#customRange${idCualidad}`
        );
        const rangeValue = this.el.nativeElement.querySelector(
          `#rangeValue${idCualidad}`
        );
        range.style.setProperty(
          '--value',
          (valor - parseFloat(range.min)) /
            (parseFloat(range.max) - parseFloat(range.min))
        );
        rangeValue.innerText = valor.toString();
      }
    }
  }

  borrarPerfil() {
    if (!this.perfilSeleccionado || !this.perfilSeleccionado.PerfilObjetivoID) {
      console.error('No profile selected for deletion.');
      return;
    }

    const perfilId = this.perfilSeleccionado.PerfilObjetivoID;

    // Llama al método del servicio para borrar perfil e interés asociado
    this.api.borrarPerfilEInteres(perfilId).subscribe(() => {
      console.log('Profile and associated interest deleted successfully.');

      // Actualiza la lista de perfiles después del borrado
      this.actualizarListaPerfiles();

      // Resetear el perfil seleccionado
      this.perfilSeleccionado = null;
      this.perfilAActualizar = null;
    });

    // Redirige a la página de perfiles
    this.router.navigate(['/perfiles']);
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
