import { Pipe, PipeTransform } from "@angular/core";
import { StringifyOptions } from "querystring";

@Pipe({ name: "BarthelLevel" })
export class BarthelLevelPipe implements PipeTransform {
  transform(value: string): string {
    if (value != "") {
      let grade = parseInt(value);
      if (grade >= 0 && grade <= 20) {
        return "极严重功能障碍";
      } else if (grade >= 25 && grade <= 45) {
        return "严重功能障碍";
      } else if (grade >= 50 && grade <= 70) {
        return "中度功能缺陷";
      } else if (grade >= 75 && grade <= 95) {
        return "轻度功能缺陷";
      } else if (grade == 100) {
        return "ADL自理";
      }
    }else{
      return "";
    }
  }
}
