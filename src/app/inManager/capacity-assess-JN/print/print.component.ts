import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { NzMessageService } from "ng-zorro-antd";
import * as _ from "underscore"; // JS工具类
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";
import { FormValidService } from "../../../common/service/FormValid.Service";
import { RegexpConfig } from "../../../common/service/GlobalConfig";
import { Local } from "../../../common/service/Storage";
import { GlobalMethod } from "../../../common/service/GlobalMethod";
import { ENgxPrintComponent } from "e-ngx-print";

@Component({
  selector: "app-print",
  templateUrl: "./print.component.html",
  styleUrls: ["./print.component.css"]
})
export class PrintComponent implements OnInit {
  tagName = "";
  constructor(
    private httpReq: HttpReqService, // Http请求服务
    private jsUtil: JsUtilsService, // 自定义JS工具类
    private router: Router, // 跳转路由
    private actRoute: ActivatedRoute, // 获取传递的参数
    private fb: FormBuilder, // 响应式表单
    private msg: NzMessageService // 消息提醒
  ) {}
  ngOnInit() {
    this.getLocalConfig();
  }
  getLocalConfig() {
    let config = JSON.parse(localStorage.getItem("serveConfig"));
    this.tagName = config.originFullName;
  }
}
