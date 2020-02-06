import { Pipe, PipeTransform } from '@angular/core';
import { SectionEnum, SubjectEnum, TypeEnum } from './../../core/models/enums.model';

@Pipe({
  name: 'translateEnums'
})
export class TranslateEnumsPipe implements PipeTransform {
  transform(value: string): string {
    const allEnums = { ...SectionEnum, ...TypeEnum, ...SubjectEnum };
    for (const v in allEnums) {
      if (value === v) {
        return allEnums[v];
      }
    }
    return value;
  }

}
