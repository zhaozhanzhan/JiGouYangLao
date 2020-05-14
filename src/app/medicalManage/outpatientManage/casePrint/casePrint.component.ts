import { Component, OnInit, ViewChild, ViewChildren } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";
import { GlobalService } from "../../../common/service/GlobalService";
import { LocalStorage } from "../../../common/service/local.storage";
import { NzMessageService, NzModalService } from "ng-zorro-antd";
import * as _ from "underscore";
import { ENgxPrintComponent } from "e-ngx-print";
@Component({
  selector: "app-casePrint",
  templateUrl: "./casePrint.component.html",
  styleUrls: ["./casePrint.component.css"]
})
export class CasePrintComponent implements OnInit {
  useInfo; //用户信息
  systemInfo; //系统信息

  // 获取传递过来得参数,显示病历信息
  obj;

  // 获取传递过来得参数,显示病人得基本信息
  oldman;

  @ViewChild("print1") printComponent1: ENgxPrintComponent; // 病历打印组件
  @ViewChildren("print2") printComponent2: any; // 处方打印组件

  printCSS = ["assets/css/common.css", "assets/css/ng-zorro-antd.min.css", "assets/css/histroyCaseDrugPrint.css"];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpReq: HttpReqService,
    private jsUtil: JsUtilsService,
    private globalService: GlobalService,
    private message: NzMessageService, //提示
    private localStorage: LocalStorage //存储
  ) {}

  ngOnInit() {
    //获得传递过来得参数
    this.obj = JSON.parse(this.route.snapshot.paramMap["params"]["data"]);
    console.log(this.obj);
    this.oldman = JSON.parse(this.route.snapshot.paramMap["params"]["oldman"]);
    console.log(this.oldman);
    
    //获得用户得详细信息
    this.useInfo = this.localStorage.getUser();
    this.systemInfo = JSON.parse(localStorage.getItem("systemInfo"));
    console.log(this.systemInfo);
  }

   // 返回
   back() {
    history.back();
  }

   /**
   * 单击打印按钮调用打印方法
   * @param {MouseEvent} [ev]
   * @memberof ApparatusCheckComponent
   */
  public clickPrint1(ev?: MouseEvent) {
    if (ev) {
      ev.stopPropagation(); // 阻止事件冒泡
    }
    this.printComponent1.print(); // 调用打印方法
  }

 /**
 * 单击打印按钮调用打印方法
 * @param {MouseEvent} [ev]
 * @memberof ApparatusCheckComponent
 */
public clickPrint2(i,ev?: MouseEvent) {
  if (ev) {
    ev.stopPropagation(); // 阻止事件冒泡
  }
  console.log(this.printComponent2);
  this.printComponent2._results[i].print(); // 调用打印方法
}
}
