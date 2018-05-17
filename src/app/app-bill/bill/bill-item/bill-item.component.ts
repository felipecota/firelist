import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable, of } from 'rxjs';
import { Router, ActivatedRoute }   from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { AppService } from '../../../app.service';
import { BillService } from '../bill.service';

@Component({
  selector: 'app-bill-item',
  templateUrl: './bill-item.component.html',
  styleUrls: ['./bill-item.component.css']
})
export class BillItemComponent implements OnInit {

  bills: Observable<any[]>;   
  members: any[]; 

  editmode: boolean;

  selected_bill: boolean;
  selected_member: boolean;
  erro: string;
  billname: string;
  billkey: string; 
  itemkey: string;
  payer: string;
  place: string = "";
  type: string;
  date: string;
  description: string;
  value: string;
  multiplier: string = "1";
  calculated: number;
  benefited: any;
 
  constructor(
    private appService: AppService,
    private billService: BillService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
  ) { }

  ngOnInit() { 

    let data = this.route.snapshot.paramMap.get('data');
    if (data && data == "edit" && this.billService.item != undefined) {
        this.onEdit(this.billService.item);
        this.editmode = true;
    } else {
        this.editmode = false;
        let d = new Date();
        this.date = d.getFullYear()+'-'+((d.getMonth()+1)<10?'0':'')+(d.getMonth()+1)+'-'+((d.getDate())<10?'0':'')+d.getDate();
        this.type = "";
    }

    this.bills = this.appService.afs.collection('bills', ref => ref.where('access.'+this.appService.user.email.replace(/\./g,'´'),'==',true))
    .snapshotChanges()
    .pipe(map(bills => {
        return bills
        .sort(
            (a,b) => a.payload.doc.data().billname.localeCompare(b.payload.doc.data().billname))
        .map(bill => {
            const data = bill.payload.doc.data();
            const id = bill.payload.doc.id;                
            return { id, ...data };                
        })
    })); 

  }

  onEdit(data): void{
    this.selected_member = true;
    this.payer = data.payer;
    this.place = data.place;
    this.type = data.type;
    let d = data.date;
    this.date = d.getFullYear()+'-'+((d.getMonth()+1)<10?'0':'')+(d.getMonth()+1)+'-'+(d.getDate()<10?'0':'')+d.getDate();
    this.description = data.description;
    this.value = data.value+'';
    this.multiplier = data.multiplier+'';
    this.calculated = data.calculated;
    this.onSelectBill(
        {
            billname: data.billname, 
            id: data.billkey
        });    
    this.benefited = data.benefited; 
    this.itemkey = data.itemkey;       
  }

  onSelectMember(m): void {
    this.selected_member = true;
    this.payer = m.email;

    if(navigator.geolocation && this.place == ""){
        navigator.geolocation.getCurrentPosition(position => {
          this.http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + position.coords.latitude + '%2C' + position.coords.longitude + '&language=en')
          .subscribe(data => {
              data['results'].forEach(result => {
                  result['address_components'].forEach(component => {
                      component['types'].forEach(type => {
                          //Double check if getCurrentPosition or http.get take too long
                          if (type == "locality" && this.place == "") {
                              this.place = component['long_name'];
                          }
                      });
                  });
              });
          });
        });
     }     
  }

  onSelectBill(b): void {

    this.selected_bill = true;
    this.erro = '';
    this.billname = b.billname;
    this.billkey = b.id;
   
    this.appService.afs.collection('bills').doc(this.billkey)
    .snapshotChanges()
    .forEach(bill => {
        if (bill.payload.exists) {
            let temp = [];          
            for (let key in bill.payload.data().access) {
                let format = key.replace(/´/g,'.').split("@");
                if (format[0].length > 20)
                    format[0] = format[0].substr(0,7)+"..."+format[0].substr(format[0].length-7,7);                
                temp.push({
                    email: key.replace(/´/g,'.'),
                    emailf: format[0]+"@"+format[1]
                });
            }
            this.members = temp;            
        }
    }); 

  }

  onChange() {
      this.calculated = Number(this.value.replace(',','.')) * Number(this.multiplier.replace(',','.'));
  }
  
  Include() { 

        if (!this.date || !this.description || this.description.trim() == '' || !this.value || Number(this.value) == NaN || Number(this.value) <= 0 || !this.benefited || this.benefited.length == 0 || !this.place || !this.type || this.type == "" || this.multiplier == "" || Number(this.multiplier) <= 0)  {

            this.erro = this.appService.language.e14;
            navigator.vibrate([500]);

        } else {  

            let date = this.date;
            let description = this.description;
            let value = this.value.replace(',','.');
            let multiplier = this.multiplier.replace(',','.');
            let payer = this.payer;
            let benefited = this.benefited; 
            let place = this.place;
            let type = this.type;           
            
            let d = new Date();
            this.date = d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
            this.description = '';
            this.value = '';
            this.multiplier = '';
            this.payer = '';
            this.benefited = '';
            this.place = '';
            this.type = '';

            let itemkey = (this.editmode ? this.itemkey : d.getFullYear()+''+d.getMonth()+''+d.getDate()+''+d.getHours()+''+d.getMinutes()+''+d.getSeconds()+''+(Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000));

            this.appService.afs.collection('bills').doc(this.billkey).update({
                ['items.'+itemkey]: {
                    payer: payer,
                    benefited: benefited,
                    date: new Date(Number(date.substring(0,4)), Number(date.substring(5,7))-1, Number(date.substring(8,10))),
                    description: description,
                    value: Number(value),
                    multiplier: Number(multiplier),
                    place: place,
                    type: type,
                    owner: this.appService.user.email
                }
            })

            this.erro = '';
            this.router.navigate(['/bill-detail/'+this.billkey+'/'+this.billname]);

        }   
    }  

}