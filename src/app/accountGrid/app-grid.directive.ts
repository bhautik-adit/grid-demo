import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
    selector: '[aditGridDef]',
    standalone: false
})
export class AditGridTemplateDirective {
    @Input('aditGridDef') field!: string;
    @Input() type: 'header' | 'column' = 'column'; // Default to column template

    constructor(public template: TemplateRef<any>) {
    }
}