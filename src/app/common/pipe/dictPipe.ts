import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'dictPipe',
})
export class DictPipe implements PipeTransform {

  transform(value: string, args: any): string {
    let result = '';
    args.forEach(element => {
      if (value == element.dictValue) {
        result = element.dictTag;
      }
    });
    return result;
  }
}