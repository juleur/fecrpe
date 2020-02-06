import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'translateDuration'
})
export class TranslateDurationPipe implements PipeTransform {
  transform(value: string): string {
    let newValue = '';
    newValue = value.replace(':', 'h');
    newValue = newValue.replace(':', 'm');
    newValue += 's';
    return newValue;
  }
}
