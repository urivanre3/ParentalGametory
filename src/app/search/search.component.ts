import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  flag?: boolean;
  flag_loading?: boolean;

  @Output() messageEvent = new EventEmitter<string>();
  message: string = 'yes';

  constructor(private api: ApiService) 
  {      this.flag = true;}

  videogames: any[] = [];
  /*  str: any; */
  search(word: string) {
    console.log('search');
    this.flag_loading = true;

    if (word != '') {
      this.api.get_juegos_por_nombre(word).subscribe((res: any) => {
        console.log('search this api gets');
        this.videogames = res.data;
        console.log('this.videogames ' + this.videogames[0].NombreJuego);
        /*  this.str = JSON.stringify(this.videogames);
       
        console.log(this.str); // Logs output to dev tools console. */
        this.flag = false;
        this.flag_loading = false;
        this.message = 'yes';
        this.messageEvent.emit(this.message);
      });
    } else {
      this.message = 'no';
      this.messageEvent.emit(this.message);
      this.flag = true;
      this.flag_loading = false;
    }
  }

  ngOnInit(): void {}
}
