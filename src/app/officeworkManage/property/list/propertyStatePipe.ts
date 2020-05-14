import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'propertyStatePipe',
  pure: true
})
export class PropertyStatePipe implements PipeTransform {

  transform(value: string): string {
    let result = '';
    switch (value) {
      case '1':
        result = '封存';
        break;
      case '2':
        result = '使用';
        break;
      case '3':
        result = '维修';
        break;
      case '4':
        result = '报废';
        break;
      default:
        break;
    }

    return result;
  }
}