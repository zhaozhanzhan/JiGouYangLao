/**
 * name:Http请求服务工具类
 * describe:对http请求做统一处理
 * author:赵展展
 * QQ:799316652
 * Email:zhanzhan.zhao@mirrortech.cn
 */
import { Injectable } from "@angular/core";
import {
  Http,
  Response,
  Headers,
  RequestOptions,
  URLSearchParams,
  RequestOptionsArgs,
  RequestMethod
} from "@angular/http";
import "rxjs/add/operator/toPromise";
import { JsUtilsService } from "./JsUtils.Service";
import { NzMessageService } from "ng-zorro-antd"; // 弹出提示消息配置
import { ServeConfigService } from "../config/serve-config.service";

@Injectable()
export class HttpReqService {
  baseUrl: String = "";

  constructor(
    private http: Http,
    private jsUtil: JsUtilsService,
    private msg: NzMessageService,
    private serveConfigService: ServeConfigService
  ) {
    this.baseUrl = this.serveConfigService.baseUrl;
  }
  /**
   * 拼接完整请求URL
   * @param url 传入接口的部分URL
   */
  private getFullUrl(url: string): string {
    this.baseUrl = this.serveConfigService.baseUrl;
    return this.baseUrl + url;
  }
  /**
   * GET请求方法
   * @param url 请求URL地址
   * @param queryParams 请求Query参数
   * @param bodyParams 请求Body参数
   */
  public get(url: string, queryParams: any, suc: Function): any {
    const that = this;
    const ipUrl = this.getFullUrl(url); // IP + 接口URL
    const queParam = this.jsUtil.queryStr(queryParams);
    let reqUrl: string = "";
    if (queParam) {
      reqUrl = ipUrl + "?" + this.jsUtil.queryStr(queryParams); // URL后拼接查询参数
    } else {
      reqUrl = ipUrl;
    }
    console.log("%c %s", "color:#0012FC;", "=====GET请求信息=====：" + reqUrl);
    this.http
      .get(reqUrl)
      .toPromise()
      .then((res: Response) => {
        let body = res["_body"];
        // console.log("接口返回的成功信息：" + body)
        if (body) {
          // 有数据返回
          const resObj = {
            data: res.json().data || {},
            code: res.json().code === 0 ? 0 : res.json().code || {},
            message: res.json().message || {},
            statusText: res.statusText,
            status: res.status,
            success: true
          }; // 返回内容 // 返回code // 返回信息
          console.log(
            "%c %s %o",
            "color:#009803;",
            "===GET返回信息===：",
            this.jsUtil.deepClone(resObj)
          );

          if (resObj.code != 0) {
            that.msg.error(resObj.message);
          }
          suc(resObj);
        } else {
          // 无数据返回
          const resObj = {
            data: res.json().data || {},
            code: res.json().code === 0 ? 0 : res.json().code || {},
            message: res.json().message || {},
            statusText: res.statusText,
            status: res.status,
            success: true
          }; // 返回内容 // 返回code // 返回信息
          console.log(
            "%c %s %o",
            "color:#009803;",
            "=====GET返回信息=====：",
            this.jsUtil.deepClone(resObj)
          );
          suc(resObj);
        }
      })
      .catch(error => {
        if (error.status == 400) {
          that.msg.error("请求错误");
          console.log("请求错误");
        } else if (error.status == 404) {
          that.msg.error("服务器找不到请求的网页");
        } else if (error.status == 500) {
          that.msg.error("服务器错误");
        } else {
          that.msg.error("服务器请求出错，请检查网络连接！");
        }

        // 无数据返回
        const resObj = {
          data: {},
          code: -1,
          message: "",
          statusText: "服务器请求出错，请检查网络连接！",
          status: -1,
          success: false
        }; // 返回内容 // 返回code // 返回信息
        suc(resObj);
      });
  }

  /**
   * POST请求方法
   * @param url 请求URL地址
   * @param queryParams 请求Query参数
   * @param bodyParams 请求Body参数
   */
  public post(
    url: string,
    queryParams: any,
    bodyParams: any,
    suc: Function
  ): any {
    const that = this;
    const ipUrl = this.getFullUrl(url); // IP + 接口URL
    const queParam = this.jsUtil.queryStr(queryParams);
    let reqUrl: string = "";
    if (queParam) {
      reqUrl = ipUrl + "?" + this.jsUtil.queryStr(queryParams); // URL后拼接查询参数
    } else {
      reqUrl = ipUrl;
    }
    bodyParams = bodyParams || {};
    console.log(
      "%c %s %o",
      "color:#0012FC;",
      "=====POST请求信息=====：" + reqUrl,
      this.jsUtil.deepClone(bodyParams)
    );
    this.http
      .post(reqUrl, bodyParams)
      .toPromise()
      .then((res: Response) => {
        let body = res["_body"];
        if (body) {
          // 有数据返回
          const resObj = {
            data: res.json().data || {},
            code: res.json().code === 0 ? 0 : res.json().code || {},
            message: res.json().message || {},
            statusText: res.statusText,
            status: res.status,
            success: true
          }; // 返回内容 // 返回code // 返回信息
          console.log(
            "%c %s %o",
            "color:#009803;",
            "===POST返回信息===：",
            this.jsUtil.deepClone(resObj)
          );
          if (resObj.code != 0) {
            that.msg.error(resObj.message);
          }
          suc(resObj);
        } else {
          // 无数据返回
          const resObj = {
            data: res.json().data || {},
            code: res.json().code === 0 ? 0 : res.json().code || {},
            message: res.json().message || {},
            statusText: res.statusText,
            status: res.status,
            success: true
          }; // 返回内容 // 返回code // 返回信息
          console.log(
            "%c %s %o",
            "color:#009803;",
            "=====POST返回信息=====：",
            this.jsUtil.deepClone(resObj)
          );
          suc(resObj);
        }
      })
      .catch(error => {
        if (error.status == 400) {
          that.msg.info("请求参数正确时异常");
          console.log("请求参数正确");
        }
        if (error.status == 404) {
          that.msg.warning("请检查路径是否正确");
        }
        if (error.status == 500) {
          that.msg.error("请求的服务器错误");
        }
        // that.msg.error("服务器请求出错，请检查网络连接！");
        // console.log(error);
        // 无数据返回
        const resObj = {
          data: {},
          code: -1,
          message: "",
          statusText: "服务器请求出错，请检查网络连接！",
          status: -1,
          success: false
        }; // 返回内容 // 返回code // 返回信息
        suc(resObj);
      });
  }
}
