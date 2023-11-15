import { Component, OnInit } from '@angular/core';
/* import { Color, ScaleType } from '@swimlane/ngx-charts'; */

@Component({
  selector: 'app-videogames',
  templateUrl: './videogames.component.html',
  styleUrls: ['./videogames.component.css']
})
export class VideogamesComponent implements OnInit {



  ngOnInit(): void {
  }

/* 

single: any[] = [
  {
    "name": "Germany",
    "value": 8940000
  },
  {
    "name": "USA",
    "value": 5000000
  },
  {
    "name": "France",
    "value": 7200000
  }
];
view: [number, number] = [700, 400];

  // options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = true;
  showXAxisLabel: boolean = true;
  yAxisLabel: string = 'Country';
  showYAxisLabel: boolean = true;
  xAxisLabel: string = 'Population';

  colorScheme: Color = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'],
    name: 'cool', // You can choose a predefined color scheme
    selectable: true,
    group: ScaleType.Ordinal
  };

  constructor() {
    Object.assign(this.single );
  }

  onSelect(single: any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(single)));
  }

  onActivate(single: any): void {
    console.log('Activate', JSON.parse(JSON.stringify(single)));
  }

  onDeactivate(single: any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(single)));
  } */
}

