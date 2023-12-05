import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
/* import { AuthService } from '../shared/auth.service'; */

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  // Form
  form: FormGroup;

  constructor(private apiService: ApiService, private router: Router) {
    // Form
    this.form = new FormGroup(
      {
        nombre: new FormControl('', [
          Validators.required,
          Validators.minLength(3),
        ]),
        correo: new FormControl('', [
          Validators.required,
          Validators.pattern(/^\S+@\S+\.\S+$/),
        ]),
        contraseña: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
        ]),
        confirmacion_contraseña: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
        ]),
      },
      {
        validators: this.es_igual,
      }
    );
  }

  ngOnInit() {}

  Registro(): void {
    if (this.form.valid) {
      this.apiService.registrarUsuario(this.form.value).subscribe(
        async () => {
          this.router.navigate(['/home']);
        },
        (error) => {
          // Aquí puedes manejar el error si es necesario
        }
      );
    } else {
      // En este bloque, puedes activar la validación personalizada para las contraseñas
      this.form.setErrors({ mustMatch: true });
    }
  }

  es_igual: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    let contraseña = group.get('contraseña')!.value;
    let confirmacontraseña = group.get('confirmacion_contraseña')!.value;
    return contraseña === confirmacontraseña ? null : { mustMatch: true };
  };
}
