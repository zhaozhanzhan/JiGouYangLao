import { Pipe, PipeTransform } from "@angular/core";
import { StringifyOptions } from "querystring";

@Pipe({ name: "MMSELevel" })
export class MMSELevelPipe implements PipeTransform {
  transform(value: string): string {
    if (value != "") {
      let grade = parseInt(value);
      if (grade >= 27) {
        return "正常";
      } else {
        return "认知功能障碍";
      }
    }
  }
}
