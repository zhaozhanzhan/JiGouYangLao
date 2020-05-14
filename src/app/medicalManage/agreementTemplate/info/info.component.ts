/*
 * @Author: dakui.tian
 * @date: Do not edit
 * @LastEditors: dakui.tian
 * @LastEditTime: 2019-08-22 16:01:38
 * @Description:
 */
import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { NzMessageService } from "ng-zorro-antd";
import { Utils } from "../../../common/utils/utils";
import { LocalStorage } from "../../../common/service/local.storage";
import { ServeConfigService } from "../../../common/config/serve-config.service";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";

declare var CKEDITOR: any;

@Component({
  selector: "app-info",
  templateUrl: "./info.component.html",
  styleUrls: ["./info.component.css"]
})
export class InfoComponent implements OnInit {
  user;

  isSaveBtnLoading = false;

  templateContent = [];
  //模板信息
  templateInfo = {
    comment: "",
    formConfiguration: "",
    id: "",
    name: "",
    typeId: ""
  }
  constructor(
    private httpReq: HttpReqService, // Http请求服务
    private route: ActivatedRoute,
    private localStorage: LocalStorage,
    private message: NzMessageService,
    private serveConfigService: ServeConfigService
  ) { }

  ngOnInit() {
    let that = this;
    this.route.params.subscribe((params: Params) => {
      const infoStr = params["info"];
      if (infoStr != "{}") {
        that.templateInfo = JSON.parse(infoStr);
        if (!Utils.isEmpty(this.templateInfo.formConfiguration)) {
          this.templateContent = JSON.parse(this.templateInfo.formConfiguration);
        }
      } else {
        that.message.error("数据传递错误，请重试！");
        history.back();
      }
    });
  }
  back() {
    history.back();
  }
  saveTemplate() {
    this.templateInfo.formConfiguration = JSON.stringify(this.templateContent);

    this.isSaveBtnLoading = true;
    let that = this;
    this.httpReq.post(
      "doctorPatientCommunication/saveTemplate",
      null,
      this.templateInfo,
      data => {
        that.isSaveBtnLoading = false;
        if (data["code"] == 0) {
          that.isSaveBtnLoading = false;
          that.message.success("模板内容保存成功！");
        }
      }
    );
  }
}
