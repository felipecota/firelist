import { Pipe, PipeTransform } from '@angular/core';
import { AppService } from './app.service'

@Pipe({
    name: 'translate',
    pure: false
})

export class TranslatePipe implements PipeTransform {

    constructor(private appservice: AppService) { }

    transform(value: string, args: any[]): any {
        if (!value) return;
        return this.appservice.language[value];
    }
}