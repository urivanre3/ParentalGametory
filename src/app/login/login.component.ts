import { Component, OnInit, } from '@angular/core';

import { FormControl, FormGroup, Validators, } from '@angular/forms';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  modal: any;
  user = {
    userName: 'kevin',
    pass: '123'
  }
  
constructor(private api : ApiService, private router: Router ) {
 
  this.form = new FormGroup({
    'email': new FormControl('',[Validators.required,Validators.email]),
    'password': new FormControl('',[Validators.required,Validators.minLength(5)]),
  });
  
}

    ngOnInit() {
     
    }
    closeModal() {
      this.modal.hide();
    }

    logIn(){
      console.log(this.user);
      this.api.singin(this.user).subscribe( (res:any) => {
        console.log(res);
        localStorage.setItem('token',res.token);
        this.router.navigate(['private']);
      })
    }

}
