import { Component, Renderer2, ElementRef } from "@angular/core";
import { HttpReqService } from "./common/service/HttpUtils.Service";
import { Utils } from "./common/utils/utils";
import { Http, Response } from "@angular/http";
import { VERSION as VERSION_ALAIN } from "@delon/theme";
import { VERSION as VERSION_ZORRO, NzModalService } from "ng-zorro-antd";
import { Router, NavigationEnd } from "@angular/router";
import { filter } from "rxjs/operators";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html"
})
export class AppComponent {
  menuList: Array<{ module: string }> = [];
  constructor(
    private httpReq: HttpReqService,
    private http: Http,
    private router: Router,
    el: ElementRef,
    renderer: Renderer2,
    private modalSrv: NzModalService
  ) {
    renderer.setAttribute(
      el.nativeElement,
      "ng-alain-version",
      VERSION_ALAIN.full
    );
    renderer.setAttribute(
      el.nativeElement,
      "ng-zorro-version",
      VERSION_ZORRO.full
    );
  }

  ngOnInit() {
    this.router.events
      .pipe(filter(evt => evt instanceof NavigationEnd))
      .subscribe(() => {
        this.modalSrv.closeAll();
      });
    this.getLocalConfig();
  }

  /**
   * 从assets中获取服务器连接配置文件，并保存到localstorage中
   * @param suc
   */
  private getLocalConfig() {
    const that = this;
    const reqUrl = "assets/config/config.json"; // IP + 接口URL
    this.http
      .get(reqUrl)
      .toPromise()
      .then((res: Response) => {
        let body = res["_body"];
        if (body) {
          // 有数据返回
          const resObj = res.json() || {}; // 返回信息
          localStorage.setItem("serveConfig", JSON.stringify(resObj));
          that.getSystemInfo();
        } else {
          // 无数据返回
          const resObj = res.json() || {}; // 返回信息
        }
      })
      .catch(error => {});
  }

  getSystemInfo() {
    let systemInfo = {
      sysTitle: "镜子信息养老服务云",
      sysBottom: "镜子信息养老云提供计算服务",
      sysLogo: "assets/img/logo.png",
      sysIco: "assets/img/logo.png"
    };
    this.httpReq.get("frontName/getName", null, data => {
      if (data["status"] == 200 && data["code"] == 0) {
        systemInfo = JSON.parse(data["data"]);
        if (Utils.isEmpty(systemInfo.sysTitle)) {
          systemInfo.sysTitle = "镜子信息养老服务云";
        }
        if (Utils.isEmpty(systemInfo.sysBottom)) {
          systemInfo.sysBottom = "镜子信息养老云提供计算服务";
        }
        if (Utils.isEmpty(systemInfo.sysLogo)) {
          systemInfo.sysLogo = "assets/img/logo.png";
        }
        if (Utils.isEmpty(systemInfo.sysIco)) {
          systemInfo.sysIco = "assets/img/logo.png";
        }
      }

      document.getElementById("icoId").setAttribute("href", systemInfo.sysIco);
      document.title = systemInfo.sysTitle;
      localStorage.setItem("systemInfo", JSON.stringify(systemInfo));
    });
  }
}
