/*
 * @Author: dakui.tian
 * @date: Do not edit
 * @LastEditors: dakui.tian
 * @LastEditTime: 2019-08-23 15:41:43
 * @Description:
 */
import { Injectable } from "@angular/core";

/**
 * 工具
 */
@Injectable()
export class Utils {
  /**
   * 是否为空
   * @param value 值
   */
  static isEmpty(value: any): boolean {
    return (
      value == undefined ||
      value == null ||
      (typeof value === "string" && value.length === 0)
    );
  }

  /**
   * 是否不为空
   * @param value 值
   */
  static isNotEmpty(value: any): boolean {
    return !Utils.isEmpty(value);
  }

  /**
   * 是否为数字
   * @param value 值
   */
  static isNumber(value: any): boolean {
    if (parseInt(value).toString() === "NaN") {
      // alert("请输入数字……");注掉，放到调用时，由调用者弹出提示。
      return false;
    } else {
      return true;
    }
  }

  /**
   * 是否数组
   * @param vaue 值
   */
  static isArray(value: any): boolean {
    return Array.isArray(value);
  }

  /**
   * 是否对象
   * @param vaue 值
   */
  static isObject(value: any): boolean {
    return typeof value === "object" && !Utils.isArray(value);
  }

  /**
   * 是否为手机号码
   * @param value 值
   */
  static isPhoneNum(value: any): boolean {
    let reg = /^1[0-9]{10}$/;
    if (reg.test(value)) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * url中如果有双斜杠替换为单斜杠
   * @param url
   * @returns {string}
   */
  static replaceUrl(url) {
    return "http://" + url.substring(7).replace(/\/\//g, "/");
  }

  /**
   * 日期对象转为日期字符串
   * @param date 需要格式化的日期对象
   * @param sFormat 输出格式,默认为yyyy-MM-dd                         年：y，月：M，日：d，时：h，分：m，秒：s
   * @example  dateFormat(new Date())                                "2017-02-28"
   * @example  dateFormat(new Date(),'yyyy-MM-dd')                   "2017-02-28"
   * @example  dateFormat(new Date(),'yyyy-MM-dd HH:mm:ss')         "2017-02-28 09:24:00"
   * @example  dateFormat(new Date(),'hh:mm')                       "09:24"
   * @example  dateFormat(new Date(),'yyyy-MM-ddThh:mm:ss+08:00')   "2017-02-28T09:24:00+08:00"
   * @returns {string}
   */
  static dateFormat(date: Date, sFormat: String = "yyyy-MM-dd"): string {
    let time = {
      Year: 0,
      TYear: "0",
      Month: 0,
      TMonth: "0",
      Day: 0,
      TDay: "0",
      Hour: 0,
      THour: "0",
      hour: 0,
      Thour: "0",
      Minute: 0,
      TMinute: "0",
      Second: 0,
      TSecond: "0",
      Millisecond: 0
    };
    if (!date) {
      return;
    }
    time.Year = date.getFullYear();
    time.TYear = String(time.Year).substr(2);
    time.Month = date.getMonth() + 1;
    time.TMonth = time.Month < 10 ? "0" + time.Month : String(time.Month);
    time.Day = date.getDate();
    time.TDay = time.Day < 10 ? "0" + time.Day : String(time.Day);
    time.Hour = date.getHours();
    time.THour = time.Hour < 10 ? "0" + time.Hour : String(time.Hour);
    time.hour = time.Hour < 13 ? time.Hour : time.Hour - 12;
    time.Thour = time.hour < 10 ? "0" + time.hour : String(time.hour);
    time.Minute = date.getMinutes();
    time.TMinute = time.Minute < 10 ? "0" + time.Minute : String(time.Minute);
    time.Second = date.getSeconds();
    time.TSecond = time.Second < 10 ? "0" + time.Second : String(time.Second);
    time.Millisecond = date.getMilliseconds();

    return sFormat
      .replace(/yyyy/gi, String(time.Year))
      .replace(/yyy/gi, String(time.Year))
      .replace(/yy/gi, time.TYear)
      .replace(/y/gi, time.TYear)
      .replace(/MM/g, time.TMonth)
      .replace(/M/g, String(time.Month))
      .replace(/dd/gi, time.TDay)
      .replace(/d/gi, String(time.Day))
      .replace(/HH/g, time.THour)
      .replace(/H/g, String(time.Hour))
      .replace(/hh/g, time.Thour)
      .replace(/h/g, String(time.hour))
      .replace(/mm/g, time.TMinute)
      .replace(/m/g, String(time.Minute))
      .replace(/ss/gi, time.TSecond)
      .replace(/s/gi, String(time.Second))
      .replace(/fff/gi, String(time.Millisecond));
  }

  /**
   *  UUID生成
   *  @returns {string}
   */
  static UUID(): string {
    return "xxxxxxxx-xxxx-6xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0,
        v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  /**
   *  短UUID生成
   *  @returns {string}
   */
  static shortUUID(): string {
    return "xx-6xy".replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(6);
    });
  }

  static GetAge(identityCard) {
    var len = (identityCard + "").length;
    if (len == 0) {
      return 0;
    } else {
      if (len != 15 && len != 18) {
        //身份证号码只能为15位或18位其它不合法
        return 0;
      }
    }
    var strBirthday = "";
    if (len == 18) {
      //处理18位的身份证号码从号码中得到生日和性别代码
      strBirthday =
        identityCard.substr(6, 4) +
        "/" +
        identityCard.substr(10, 2) +
        "/" +
        identityCard.substr(12, 2);
    }
    if (len == 15) {
      strBirthday =
        "19" +
        identityCard.substr(6, 2) +
        "/" +
        identityCard.substr(8, 2) +
        "/" +
        identityCard.substr(10, 2);
    }
    //时间字符串里，必须是“/”
    var birthDate = new Date(strBirthday);
    var nowDateTime = new Date();
    var age = nowDateTime.getFullYear() - birthDate.getFullYear();
    //再考虑月、天的因素;.getMonth()获取的是从0开始的，这里进行比较，不需要加1
    if (
      nowDateTime.getMonth() < birthDate.getMonth() ||
      (nowDateTime.getMonth() == birthDate.getMonth() &&
        nowDateTime.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  }

  /**
   *深度拷贝json对象的函数，
   *
   * @static
   * @param {Object} source 待拷贝对象
   * @returns {*} 返回一个新的对象
   * @memberof Utils
   */
  static deepCopy(source: Object): any {
    if (null == source || {} == source || [] == source) {
      return source;
    }

    let newObject: any;
    let isArray = false;
    if ((source as any).length) {
      newObject = [];
      isArray = true;
    } else {
      newObject = {};
      isArray = false;
    }

    for (let key of Object.keys(source)) {
      if (null == source[key]) {
        newObject[key] = source[key];
      } else {
        let sub =
          typeof source[key] == "object"
            ? this.deepCopy(source[key])
            : source[key];
        if (isArray) {
          newObject.push(sub);
        } else {
          newObject[key] = sub;
        }
      }
    }
    return newObject;
  }
}
