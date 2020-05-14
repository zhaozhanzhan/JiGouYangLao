/**
 * name:JS数据处理服务工具类
 * describe:对数据进入处理的方法工具类
 * author:赵展展
 * QQ:799316652
 * Email:zhanzhan.zhao@mirrortech.cn
 */
import { Injectable } from '@angular/core'; // 注入服务注解
import * as moment from 'moment'; // 时间格式化插件
@Injectable()
export class JsUtilsService {
  constructor() {}

  /**
   * 将对象转换为'&'和'='拼接的URL字符串
   * @param  {Object} obj 要转换的对象
   * @return {String} 返回转换后的字符串
   */
  public queryStr(obj: any): string {
    if (!obj) return '';
    let pairs = [];
    for (let key in obj) {
      let value = obj[key];
      if (value instanceof Array) {
        for (let i = 0; i < value.length; ++i) {
          pairs.push(encodeURIComponent(key + '[' + i + ']') + '=' + encodeURIComponent(value[i]));
        }
        continue;
      }
      pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
    }
    return pairs.join('&');
  }

  /**
   * 深度拷贝对象
   * @param {any} obj 要拷贝的对象或数组
   * @return {any} 返回新的对象或数组
   * @memberof JsUtilsService
   */
  public deepClone(obj: any): any {
    let copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || 'object' != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
      copy = new Date();
      copy.setTime(obj.getTime());
      return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
      copy = [];
      // for (var i = 0, len = obj.length; i < len; i++) {
      //   copy[i] = this.deepClone(obj[i]);
      // }
      for (var key in obj) {
        copy[key] = this.deepClone(obj[key]);
      }
      return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
      copy = {};
      for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = this.deepClone(obj[attr]);
      }
      return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
  }

  /**
   * 格式化时间
   * @param {*} date 要格式化的日期
   * @param {string} formatStr 格式化后的日期形式
   * @returns {string} 返回格式化之后的日期
   * @memberof JsUtilsService
   */
  public dateFormat(date: any, formatStr?: string): string {
    formatStr = formatStr || 'YYYY-MM-DD';
    const result = moment(date).format(formatStr);
    if (result == 'Invalid date') {
      return '';
    }
    return result;
  }
}
