import { PipeTransform, Pipe } from '@angular/core';

@Pipe({name: 'filter'})
export class ListFilterPipe implements PipeTransform {
    transform(items: any[], filter: string): any {
        if (!items || !filter) {
            return items;
        }   
       
        return items.filter(items => { 
            return items.listkey == filter; 
        });
    }
}