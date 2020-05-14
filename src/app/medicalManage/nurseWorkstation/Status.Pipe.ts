/**
 * name:入院状态管道
 * describe:将入院状态数值转换中文状态返回
 * author:赵展展
 * QQ:799316652
 * Email:zhanzhan.zhao@mirrortech.cn
 */
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "statusPipe"
})
export class StatusPipe implements PipeTransform {
  constructor() {}
  transform(value: any) {
    let state: string = "";
    if (value == "0") {
      state = "正常";
    } else if (value == "1") {
      state = "出院";
    } else if (value == "2") {
      state = "新入院";
    } else if (value == "3") {
      state = "请假";
    } else if (value == "4") {
      state = "死亡";
    } else if (value == "5") {
      state = "新转院";
    } else if (value == "6") {
      state = "转科中";
    } else if (value == "7") {
      state = "出院中";
    } else if (value == "") {
      state = "未入住";
    }
    return state;
  }
}
