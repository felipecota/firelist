import { Component, OnInit } from '@angular/core';
import { Router }   from '@angular/router';
import { Observable, ArgumentOutOfRangeError } from 'rxjs'
import { map } from 'rxjs/operators';
import { firestore } from 'firebase/app';
import * as CryptoJS from 'crypto-js'; 

import { AppService } from '../../app.service'
import { environment } from '../../../environments/environment';
import { BillService } from '../../app-bill/bill.service';
import { ListService } from '../list.service';

@Component({
  selector: 'app-list-detail',
  templateUrl: './list-detail.component.html',
  styleUrls: ['./list-detail.component.css']
})

export class ListDetailComponent implements OnInit {

    lists: Observable<any[]>;
    items: any[];
    len: number = 0;

    constructor(
        private appService: AppService,
        private router: Router,
        private billService: BillService,
        private listService: ListService,
    ) { }
  
    ngOnInit() { 

        this.lists = this.appService.afs.collection('lists', ref => ref.where('access.'+this.appService.user.email.replace(/\./g,'´'),'==',true))
        .snapshotChanges()
        .pipe(map(lists => {
            this.len = lists.length;
            return lists
            .sort(
                (a,b) => a.payload.doc.data()["listname"].localeCompare(b.payload.doc.data()["listname"]))
            .map(list => {                
                let temp = [];
                const data = list.payload.doc.data();                
                for (let key in data["items"]) {
                    temp.push({
                        itemkey: key,
                        itemname: data["items"][key].itemname,
                        amount: data["items"][key].amount
                    });
                }
                data["items"] = temp.sort((a,b) => a.itemname.localeCompare(b.itemname));
                const id = list.payload.doc.id;                
                return { id, ...(data as {}) };                
            })
        }));    
            
    }

    onSelect(list, itemkey): void {       
        this.appService.afs.collection('lists').doc(list.id).update({
            ['items.'+itemkey]: firestore.FieldValue.delete()
        })
    }

    onEdit(item,list): void {
        this.appService.afs.collection('lists').doc(list.id).update({
            ['items.'+item.itemkey]: firestore.FieldValue.delete()
        })        
        this.listService.item = {
            billkey: '',
            billname: '',
            itemkey: '',
            payer: '',
            date: new Date,
            place: '',
            description: item.itemname,
            amount: item.amount,
            type: '',
            value: 0,
            multiplier: 1,
            calculated: 0,
            benefited: []
        }
        this.listService.list = list;
        this.router.navigate(['/list-item/new']);         
    }

    backup(listid, listname) {
        let subs = this.appService.afs.collection('lists').doc(listid)
        .snapshotChanges()
        .subscribe(bill => {
            let payload = bill.payload.data();
            let now = new Date();
            let crypto = CryptoJS.AES.encrypt(JSON.stringify({
                type: "list",
                items: payload["items"],
                access: payload["access"]
            }), environment.cryptoPass).toString();
            let data = new Blob([crypto], {type: 'text/plain'});              
            let link = document.createElement('a');
            link.href = window.URL.createObjectURL(data);
            link.setAttribute('download', 'backup_'+this.appService.language["t5"].toLowerCase()+'_'+listname.toLowerCase()+'_'+now.getFullYear()+now.getMonth()+now.getDate()+'.txt');
            document.body.appendChild(link);    
            link.click();
            document.body.removeChild(link);                          
            subs.unsubscribe();
        });

    }      

}
