import { Pipe, PipeTransform } from "@angular/core";
import * as _ from "underscore"; // Underscore工具类
@Pipe({
  name: "sliceStr"
})
export class SliceStrPipe implements PipeTransform {
  /**
   * 字符串截取管道
   * @param {*} value 原始字符串
   * @param {boolean} [isUse=true] 设置是否启用管道，默认为true启用
   * @param {number} [len=10] 设置超过多少个字符开始截取 默认为10个字符
   * @param {string} [mark="..."] 设置超过之后显示的字符
   * @returns {*}
   * @memberof SliceStrPipe
   */
  transform(
    value: any,
    isUse: boolean = true,
    len: number = 10,
    mark: string = "..."
  ): any {
    if (_.isString(value)) {
      // 是字符串
      if (_.isBoolean(isUse) && isUse) {
        // 管道生效
        if (_.isNumber(len) && value.length > len) {
          // 字符串长度大于设置值
          const str = value.substr(0, len) + mark;
          return str;
        } else {
          // 字符串长度小于等于设置值
          return value;
        }
      } else {
        // 管道不生效
        return value;
      }
    } else {
      // 非字符串
      return value;
    }
  }
}
