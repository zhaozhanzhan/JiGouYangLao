import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { NzMessageService } from "ng-zorro-antd";
@Injectable()
export class ServeConfigService {
  private _baseUrl = "";
  private _imgUploadUrl = "";
  private _mobileSignUrl = "";

  public get baseUrl() {
    let serveConfig = JSON.parse(localStorage.getItem("serveConfig")) || {};
    return serveConfig.baseUrl;
  }

  public get imgUploadUrl() {
    let serveConfig = JSON.parse(localStorage.getItem("serveConfig")) || {};
    return serveConfig.imgUploadUrl;
  }
  public get mobileSignUrl() {
    let serveConfig = JSON.parse(localStorage.getItem("serveConfig")) || {};
    return serveConfig.mobileSignUrl;
  }

  public set baseUrl(baseUrl: string) {
    this._baseUrl = baseUrl;
  }
  public set imgUploadUrl(imgUploadUrl: string) {
    this._imgUploadUrl = imgUploadUrl;
  }
  public set mobileSignUrl(mobileSignUrl: string) {
    this._mobileSignUrl = mobileSignUrl;
  }
  public constructor(private http: Http, private msg: NzMessageService) {}

  private getLocalConfig(suc: Function) {
    const that = this;
    const reqUrl = "assets/config/config.json"; // IP + 接口URL
    this.http
      .get(reqUrl)
      .timeout(20000)
      .toPromise()
      .then((res: Response) => {
        let body = res["_body"];
        if (body) {
          // 有数据返回
          const resObj = res.json() || {}; // 返回信息
          suc(resObj);
        } else {
          // 无数据返回
          const resObj = res.json() || {}; // 返回信息
          suc(resObj);
        }
      })
      .catch(error => {
        if (error.status == 400) {
          that.msg.error("配置文件丢失！");
        } else if (error.status == 404) {
          that.msg.error("配置文件丢失！");
        } else if (error.status == 500) {
          that.msg.error("配置文件丢失！");
        } else {
          that.msg.error("配置文件丢失！");
        }
        // 无数据返回
        const resObj = {}; // 返回内容 // 返回code // 返回信息
        suc(resObj);
      });
  }
}
