import { Injectable } from '@angular/core';
import { Item } from '../item';

// The @Injectable() decorator tells TypeScript to emit metadata about the service. The metadata specifies that Angular may need to inject other dependencies into this service.
@Injectable() 
export class ListService {
    item: Item;
    list: any;
}