import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit(): void {}

  @Input() items: any[] = [];

  seeProduct(item: any) {
    console.log('method seeProduct');
    let productId;
    productId = item.idvideojuego;
    console.log('productId == ' + productId);
    this.router.navigate(['/product', productId]);
  }

  showCard(item: any) {
    console.log('method showcard of card component');
    console.log(item);
    return item;
  }

}
