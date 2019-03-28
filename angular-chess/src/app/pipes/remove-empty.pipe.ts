import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'removeEmpty'
})
export class RemoveEmptyPipe implements PipeTransform {

    transform(value: Array<any>, args?: any): any {


        const flattenedArray = [];

        value.forEach(value_of_array => {
            if (value_of_array instanceof Array) {
                flattenedArray.push(...value_of_array);
            }
        });

        return flattenedArray.filter(piece => piece !== null && piece !== undefined).sort((a: any, b: any) => {

            return a.id - b.id;

        });

    }

}
