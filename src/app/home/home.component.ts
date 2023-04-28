import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private apiService: ApiService) {
    this.flag_search=false;
   }

  ngOnInit(): void { }

  flag_search?:boolean;

  message:string | undefined;

  receiveMessage($event: string | undefined) {

    if($event=="yes"){
      this.flag_search=true;

    }else{
    this.flag_search=false;

    }
    

  }

}
