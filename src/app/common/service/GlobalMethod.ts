/**
 * name:全局方法类
 * describe:全局共用的方法工具类
 * author:赵展展
 * QQ:799316652
 * Email:zhanzhan.zhao@mirrortech.cn
 */
import { Injectable } from "@angular/core"; // 注入服务注解
import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { NzModalService } from "ng-zorro-antd";
import * as _ from "underscore"; // underscore工具类

@Injectable()
export class GlobalMethod {
  constructor() {}

  /**
   * 全局路由跳转页面方法
   * @static 静态方法
   * @param {string} url 相对路由或绝对路径 ex:'info'或'../info'或'/nursingHome/medical'
   * @param {Router} router 全局路由对象
   * @param {ActivatedRoute} actRoute 当前路由对象
   * @param {*} [param] 要传递的参数信息
   * @memberof GlobalMethod
   */
  public static changeRoute(
    url: string,
    router: Router,
    actRoute: ActivatedRoute,
    param?: any
  ): void {
    if (param) {
      if (_.isObject(param)) {
        // 是对象
        if (!_.isEmpty(param)) {
          // 非空对象
          router.navigate([url, param], {
            relativeTo: actRoute
          });
        } else {
          // 空对象
          router.navigate([url], {
            relativeTo: actRoute
          });
        }
      } else if ((_.isString(param) && param.length > 0) || _.isNumber(param)) {
        // 非对象
        const paramObj: any = {};
        paramObj.paramVal = param;
        router.navigate([url, paramObj], {
          relativeTo: actRoute
        });
      }
    } else {
      router.navigate([url], {
        relativeTo: actRoute
      });
    }
  }

  /**
   * 禁用整个表单对象
   * @static 静态方法
   * @param {FormGroup} formObj 传入要禁用的表单对象FormGroup
   * @memberof GlobalMethod
   */
  public static disableForm(formObj: FormGroup): void {
    const formCtrl = formObj.controls;
    for (const i in formCtrl) {
      formCtrl[i].disable();
    }
  }

  /**
   * 启用整个表单对象
   * @static 静态方法
   * @param {FormGroup} formObj 传入要启用的表单对象FormGroup
   * @memberof GlobalMethod
   */
  public static enableForm(formObj: FormGroup): void {
    const formCtrl = formObj.controls;
    for (const i in formCtrl) {
      formCtrl[i].enable();
    }
  }

  /**
   * 给表单对象赋值
   * @static 静态方法
   * @param {FormGroup} formObj 传入要赋值的表单对象
   * @param {Object} valObj 要赋的值对象
   * @memberof GlobalMethod
   */
  public static setForm(formObj: FormGroup, valObj: Object): void {
    formObj.patchValue(valObj);
  }

  /**
   * 计算数组的和
   * @static 静态方法
   * @param {*} calArr 传入要计算的数组
   * @returns 返回合计的值
   * @memberof GlobalMethod
   */
  public static arrSum(calArr: Array<any>) {
    if (!_.isArray(calArr)) {
      return;
    }
    let totalNum = 0;
    calArr.forEach(curVal => {
      const convert = parseFloat(curVal);
      if (_.isNumber(convert)) {
        totalNum += convert;
      }
    });
    return totalNum;
  }
}
