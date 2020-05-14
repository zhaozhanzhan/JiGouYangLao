import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'serviceType'
})
export class ServiceTypePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if(value === '0') return '即时服务';
    if(value === '1') return '日服务';
    if(value === '2') return '周服务';
    if(value === '3') return '月服务';
    return null;
  }

}
