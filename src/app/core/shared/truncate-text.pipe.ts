import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'truncate'
})
export class TruncateTextPipe implements PipeTransform {

    transform(value: string, limit: number = 60, trail: string = '...'): string {
        let result = value || '';

        if (value.length > limit) {
            result = value.slice(0, limit) + trail;
        }

        return result;
    }
}
