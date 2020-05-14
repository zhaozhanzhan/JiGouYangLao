import { Pipe, PipeTransform } from "@angular/core";
import { StringifyOptions } from "querystring";

@Pipe({ name: "TumbleLevel" })
export class TumbleLevelPipe implements PipeTransform {
  transform(value: string): string {
    if (value != "") {
      let grade = parseInt(value);
      if (grade >= 23 && grade <= 24) {
        return "轻度危险";
      } else if (grade >= 21 && grade <= 22) {
        return "中度危险";
      } else if (grade >= 18 && grade <= 20) {
        return "高度危险";
      } else if (grade <= 17) {
        return "极度危险";
      } else {
        return "暂无风险";
      }
    }
  }
}
