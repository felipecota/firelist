import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})

export class ListComponent implements OnInit {

    people: FirebaseListObservable<any[]>; 

    constructor(private angularFire: AngularFireDatabase) {
      this.people = angularFire.list('people');
    }

    ngOnInit() { }

    onSelect(key): void {
      if (navigator.onLine)
        this.angularFire.list("people").remove(key).then(() => console.log('person removed: ' + key)),
          (e: any) => console.log(e.message);             
    }

}
