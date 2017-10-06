import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service'

@Component({
  selector: 'app-list-detail',
  templateUrl: './list-detail.component.html',
  styleUrls: ['./list-detail.component.css']
})

export class ListDetailComponent implements OnInit {

      items: any[];
      lists: any[];    
  
      constructor(
          private appService: AppService
      ) { }
  
      ngOnInit() { 
          this.appService.items.subscribe(items => this.items = items);
          this.appService.lists.subscribe(lists => this.lists = lists);
      }

      onSelect(key): void {
          this.appService.items.remove(key).then(() => console.log('item removed: ' + key)),
            (e: any) => console.log(e.message);             
      }

}
