import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Component({
  selector: 'app-cadastro-pessoa-lista',
  templateUrl: './cadastro-pessoa-lista.component.html',
  styleUrls: ['./cadastro-pessoa-lista.component.css']
})

export class CadastroPessoaListaComponent implements OnInit {

    pessoas: FirebaseListObservable<any[]>; 

    constructor(private angularFire: AngularFireDatabase) {
      this.pessoas = angularFire.list('pessoas');
    }

    ngOnInit() { }

    onSelect(key): void {
      if (navigator.onLine)
        this.angularFire.list("pessoas").remove(key).then(() => console.log('pessoa apagada: ' + key)),
          (e: any) => console.log(e.message);             
    }

}
