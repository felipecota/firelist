import { FormsModule, NgForm } from '@angular/forms';
import { Component } from '@angular/core';
import { language } from '../../environments/language';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})

export class ItemComponent { 
  
  t4: string;
  t5: string;

  constructor() {
    this.t4 = language.t4;
    this.t5 = language.t5;
  }
}
