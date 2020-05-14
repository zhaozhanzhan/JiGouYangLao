/**
 * name:入院状态管道
 * describe:将入院状态数值转换中文状态返回
 * author:赵展展
 * QQ:799316652
 * Email:zhanzhan.zhao@mirrortech.cn
 */
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "dosageFormPipe"
})
export class DosageFormPipe implements PipeTransform {
  constructor() {}
  transform(value: any) {
    let state: string = "";
    if (value == "0") {
      state = "片剂";
    } else if (value == "1") {
      state = "胶囊剂";
    } else if (value == "2") {
      state = "口服酊膏剂";
    } else if (value == "3") {
      state = "口服丸剂";
    } else if (value == "4") {
      state = "口服颗粒、粉、散剂";
    } else if (value == "5") {
      state = "外用酊、膏、贴、粉剂";
    } else if (value == "6") {
      state = "外用涂剂、栓剂";
    } else if (value == "7") {
      state = "注射剂";
    } else if (value == "8") {
      state = "兴奋剂";
    } else if (value == "9") {
      state = "麻黄碱制剂";
    }
    return state;
  }
}
