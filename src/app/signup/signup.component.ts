import { Component, OnInit } from '@angular/core';
import { FormBuilder, AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
/* import { AuthService } from '../shared/auth.service'; */

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  // Form
  form: FormGroup;

  constructor(private apiService: ApiService, private router: Router) {
    // Form
    this.form = new FormGroup({
      'nombre': new FormControl('', [Validators.required, Validators.minLength(3)]),
      'correo': new FormControl('', [Validators.required, Validators.email]),
      'contraseña': new FormControl('', [Validators.required, Validators.minLength(8)]),
      'confirmacion_contraseña': new FormControl('', [Validators.required, Validators.minLength(8)]),
      /* 'address': new FormControl('', [Validators.required, Validators.minLength(3)]),
      'city': new FormControl('', [Validators.required, Validators.minLength(3)]), */
    }, {
      validators: this.es_igual
    });
  }

  ngOnInit() { }

  Registro(): void {
    if (this.form.valid) {
      this.apiService.registrarUsuario(this.form.value).subscribe(async () => {
        this.router.navigate(['/home']);
      });
    }
  }

  es_igual: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    let contraseña = group.get('contraseña')!.value;
    let confirmacontraseña = group.get('confirmacion_contraseña')!.value
    return contraseña === confirmacontraseña ? null : { mustMatch: true }
  }

  
}
