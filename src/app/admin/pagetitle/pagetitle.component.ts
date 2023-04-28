import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-pagetitle',
  templateUrl: './pagetitle.component.html',
  styleUrls: ['./pagetitle.component.css']
})
export class PagetitleComponent implements OnChanges {

  
  
  // Parameters
  @Input() title = '';
  @Input() path = '';

  // Attributes
  pathArray: string[] = [];

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    // Breadcrumb
    this.breadcrumb();
  }

  breadcrumb(): void {
    this.pathArray = this.path.split('/');
    this.pathArray = this.pathArray.slice(1, this.pathArray.length);    
  }
}
