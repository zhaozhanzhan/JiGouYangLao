import { Pipe, PipeTransform } from "@angular/core";
import { StringifyOptions } from "querystring";

@Pipe({ name: "BradenLevel" })
export class BradenLevelPipe implements PipeTransform {
  transform(value: string): string {
    if (value != "") {
      let grade = parseInt(value);
      if (grade >= 15 && grade <= 18) {
        return "轻度危险";
      } else if (grade >= 13 && grade <= 14) {
        return "中度危险";
      } else if (grade >= 10 && grade <= 12) {
        return "高度危险";
      } else if (grade <= 9) {
        return "极度危险";
      } else {
        return "暂无潜在危险";
      }
    }
  }
}
