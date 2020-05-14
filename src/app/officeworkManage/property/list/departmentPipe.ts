import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'departmentPipe',
})
export class DepartmentPipe implements PipeTransform {

  transform(value: string, args: any): string {
    let result = '';
    args.forEach(element => {
      if (value == element.id) {
        result = element.name;
      }
    });
    return result;
  }
}