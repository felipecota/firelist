import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators';

import { AppService } from '../../app.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-bill-form',
  templateUrl: './bill-form.component.html',
  styleUrls: ['./bill-form.component.css']
})

export class BillFormComponent implements OnInit {

    erro: string;
    billname: string = "";
    bills: Observable<any[]>;
    length: any;
   
    constructor(
        private appService: AppService
    ) { }

    ngOnInit() {     

        this.bills = this.appService.afs.collection('bills', ref => ref.where('access.'+this.appService.user.email.replace(/\./g,'´'),'==',true))
        .snapshotChanges()
        .pipe(
            map(bills => {
                this.length = bills.length;
                return bills
                .sort(
                    (a,b) => a.payload.doc.data()["billname"].localeCompare(b.payload.doc.data()["billname"]))
                .map(bill => {
                    const data = bill.payload.doc.data();
                    const id = bill.payload.doc.id;                
                    return { id, ...data };                
                })
            })
        ); 

    }

    Include() { 

        let d = new Date();
        let billkey = d.getFullYear()+''+d.getMonth()+''+d.getDay()+''+d.getHours()+''+d.getMinutes()+''+d.getSeconds()+''+(Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000);
        let billname = this.billname;
        this.billname = '';        

        if (this.length >= environment.limit) {

            this.erro = this.appService.language.e18;        
        
        } else if (!billname || billname == '')  {

            this.erro = this.appService.language.e6;
            navigator.vibrate([500]);

        } else {

            this.erro = '';
            this.appService.afs.collection('bills').doc(billkey).set({
                billname: billname,
                access: {
                    [this.appService.user.email.replace(/\./g,'´')]: true
                }
            });
        }
    }  

    onSelect(id: string, access): void {

        if (Object.keys(access).length == 1) {
            this.erro = '';
            if (confirm(this.appService.language.m7))
                this.appService.afs.collection('bills').doc(id).delete();
        } else
            this.erro = this.appService.language.e15;

    }   


    readThis(inputValue: any): void {
        var file: File = inputValue.files[0];
        var myReader: FileReader = new FileReader();
        myReader.onloadend = function (e) {
            console.log(myReader.result);
        }

        myReader.readAsText(file);
    }    

    fileChange(event) {
       
        if (this.billname == '') {
            this.erro = this.appService.language.e6;
            navigator.vibrate([500]);
        } else {        
            this.erro = '';
            let fileList: FileList = event.target.files;
            if(fileList.length > 0) {
                let reader = new FileReader();
                reader.onload = () => {
                    let items = JSON.parse(reader.result as string);

                    let d = new Date();
                    let billkey = d.getFullYear()+''+d.getMonth()+''+d.getDay()+''+d.getHours()+''+d.getMinutes()+''+d.getSeconds()+''+(Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000);
                    let billname = this.billname;

                    this.appService.afs.collection('bills').doc(billkey).set({
                        billname: billname,
                        access: {
                            [this.appService.user.email.replace(/\./g,'´')]: true
                        },
                        items: items
                    });                    
                }
                reader.readAsText(fileList[0]);      
            }
        }       
    }
}
