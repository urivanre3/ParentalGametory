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
      'displayName': new FormControl('', [Validators.required, Validators.minLength(3)]),
      'email': new FormControl('', [Validators.required, Validators.email]),
      'password': new FormControl('', [Validators.required, Validators.minLength(8)]),
      'confirmPassword': new FormControl('', [Validators.required, Validators.minLength(8)]),
      'address': new FormControl('', [Validators.required, Validators.minLength(3)]),
      'city': new FormControl('', [Validators.required, Validators.minLength(3)]),
    }, {
      validators: this.mustMatch
    });
  }

  ngOnInit() { }

  signUp(): void {
    if (this.form.valid) {
      this.apiService.addCustomer(this.form.value).subscribe(async () => {
        this.router.navigate(['/home']);
      });
    }
  }

  mustMatch: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    let pass = group.get('password')!.value;
    let confirmPass = group.get('confirmPassword')!.value
    return pass === confirmPass ? null : { mustMatch: true }
  }

  
}
