import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute }   from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { AppService } from '../../app.service';
import { BillService } from '../bill.service';
import { environment } from '../../../environments/environment';
import { DatePipe } from '@angular/common'

@Component({
  selector: 'app-bill-item',
  templateUrl: './bill-item.component.html',
  styleUrls: ['./bill-item.component.css']
})
export class BillItemComponent implements OnInit, OnDestroy {

  bills: Observable<any[]>;   
  members: any[]; 
  len: number = 0;

  editmode: boolean;
  
  selected_bill: boolean;
  erro: string;
  billname: string;
  billkey: string; 
  itemkey: string;
  payer: string = "";
  place: string = "";
  type: string;
  dateForm: Date;
  description: string;
  value: string;
  multiplier: string = "1";
  calculated: number;
  benefited: any;
  title: string = this.appService.language['t14'];

  sub: any;

  constructor(
    private appService: AppService,
    private billService: BillService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    public datepipe: DatePipe
  ) { }

  ngOnInit() { 

    let data = this.route.snapshot.paramMap.get('data');
    if (data && data == "edit" && this.billService.item != undefined) {
        this.onEdit(this.billService.item);
        this.editmode = true;
    } else if (data && data == "new" && this.billService.item != undefined) {        
        this.editmode = false;    
        this.description = this.billService.item.description;
    } else {
        this.editmode = false;
        this.dateForm = new Date();
        this.type = "";
    }

    this.bills = this.appService.afs.collection('bills', ref => ref.where('access.'+this.appService.user.email.replace(/\./g,'´'),'==',true))
    .snapshotChanges()
    .pipe(map(bills => {

        this.len = bills.length;

        if (localStorage.getItem('lastBill')) {
            let result = bills.find(bill => bill.payload.doc.id == localStorage.getItem('lastBill'));
            if (result != undefined) {
                const data = result.payload.doc.data();
                const id = result.payload.doc.id;                
                this.onSelectBill({ id, ...(data as {}) });
            }
        }

        return bills
        .sort(
            (a,b) => a.payload.doc.data()["billname"].localeCompare(b.payload.doc.data()["billname"]))
        .map(bill => {
            const data = bill.payload.doc.data();
            const id = bill.payload.doc.id;                
            return { id, ...(data as {}) };                
        })
    })); 

  }

  ngOnDestroy() {
    if (this.sub != undefined)
        this.sub.unsubscribe();
  }  

  onEdit(data): void {
    this.payer = data.payer;
    this.place = data.place;
    this.type = data.type;
    this.dateForm = data.date;
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

  onSelectMember() {
    if(navigator.geolocation && this.place == ""){
        navigator.geolocation.getCurrentPosition(position => {
          this.http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + position.coords.latitude + '%2C' + position.coords.longitude + '&language=en&key=' + environment.apiGeolocationKey)
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
    this.title = b.billname;
    localStorage.setItem('lastBill', b.id);
   
    this.sub = this.appService.afs.collection('bills').doc(this.billkey)
    .snapshotChanges()
    .subscribe(bill => {
        if (bill.payload.exists) {
            let temp = [];          
            for (let key in bill.payload.data()["access"]) {
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

    console.log(this.place);

    if (this.members && this.members.length >= environment.limit_itens){
        this.erro = this.appService.language.e18;     
    } else if (!this.payer || this.payer == "" || !this.dateForm || !this.description || this.description.trim() == '' || !this.value || Number(this.value) == NaN || !this.benefited || this.benefited.length == 0 || !this.place || this.place == "" || !this.type || this.type == "" || this.multiplier == "" || Number(this.multiplier) <= 0)  {
        this.erro = this.appService.language.e14;
        navigator.vibrate([500]);
    } else {  

        let date = this.dateForm;
        let description = this.description;
        let value = this.value.replace(',','.');
        let multiplier = this.multiplier.replace(',','.');
        let payer = this.payer;
        let benefited = this.benefited; 
        let place = this.place;
        let type = this.type;           
        
        let d = new Date();
        this.dateForm = d;
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
                date: date,
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

    dateChanged(eventDate: string): Date | null {
        return !!eventDate ? new Date(eventDate) : null;
    }  

}