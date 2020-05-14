import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";
import { GlobalService } from "../../../common/service/GlobalService";
import { LocalStorage } from "src/app/common/service/local.storage";
import { NzMessageService, NzModalService } from "ng-zorro-antd";
import { ENgxPrintComponent } from "e-ngx-print";
import * as _ from "underscore";
@Component({
  selector: "app-longTerm",
  templateUrl: "./longTerm.component.html",
  styleUrls: ["./longTerm.component.css"]
})
export class LongTermComponent implements OnInit {
  public isPrintNow: boolean = false; // 是否正在打印
  // public printCSS: Array<string> = [
  //   "assets/css/common.css",
  //   "assets/css/ng-zorro-antd.min.css"
  // ]; // 打印内容css文件路径
  public printStyle: string = `
  .left{
    width:100px;
    float:left
  }

  .w2{
    width:500x;
    float:left
  }
  `;
  @ViewChild("print") printComponent: ENgxPrintComponent; // 打印组件
  isShow = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpReq: HttpReqService,
    private jsUtil: JsUtilsService,
    private globalService: GlobalService,
    private message: NzMessageService, //提示
    private localStorage: LocalStorage //存储
  ) {}

  ngOnInit() {}

  /**
   * 单击打印按钮调用打印方法
   * @param {MouseEvent} [ev]
   * @memberof MedicalRecordComponent
   */
  public clickPrint(ev?: MouseEvent) {
    if (ev) {
      ev.stopPropagation(); // 阻止事件冒泡
    }
    this.isPrintNow = true; // 正在打印
    this.isShow = true;
    this.printComponent.print(); // 调用打印方法
  }

  /**
   * 打印完成
   * @memberof MedicalRecordComponent
   */
  public printComplete() {
    this.isPrintNow = false;
    this.isShow = false;
  }
  // 返回
  back(e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    history.back();
  }
}
