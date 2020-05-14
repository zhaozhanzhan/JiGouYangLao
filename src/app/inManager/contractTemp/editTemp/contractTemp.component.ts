/*
 * @Author: dakui.tian
 * @date: Do not edit
 * @LastEditors: dakui.tian
 * @LastEditTime: 2019-08-22 16:31:28
 * @Description:
 */
import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { TagValue } from "../tagValue";
import { NzMessageService } from "ng-zorro-antd";
import { Utils } from "../../../common/utils/utils";
import { LocalStorage } from "../../../common/service/local.storage";
import { ServeConfigService } from "../../../common/config/serve-config.service";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";

declare var CKEDITOR: any;

@Component({
  selector: "app-contractTemp",
  templateUrl: "./contractTemp.component.html",
  styleUrls: ["./contractTemp.component.css"]
})
export class ContractTempComponent implements OnInit {
  user;

  isSaveBtnLoading = false;

  //合同信息
  contractInfo = {
    id: "",
    createDate: "",
    noteTaker: "",
    updateDate: "",
    modifier: "",
    name: "",
    tempMemo: "",
    startOrStop: 2
  };
  //配置的合同内容
  templateContent = [];

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
        that.contractInfo = JSON.parse(infoStr);
        const tempMemo = that.contractInfo.tempMemo;

        if (!Utils.isEmpty(tempMemo)) {
          this.templateContent = JSON.parse(tempMemo);
        }
      } else {
        that.message.error("数据传递错误，请重试！");
        history.back();
      }
    });
  }

  //修改协议模板
  modifyTemplate(isRelease?: boolean, isModifyState: boolean = false) {
    this.isSaveBtnLoading = true;
    let that = this;
    this.contractInfo.tempMemo = JSON.stringify(this.templateContent);
    if (isModifyState) {
      if (isRelease) {
        this.contractInfo.startOrStop = 1;
      } else {
        this.contractInfo.startOrStop = 2;
      }
    }
    this.user = this.localStorage.getUser();
    that.contractInfo.modifier = this.user.data.name;
    this.httpReq.post(
      "contractTemplate/edit",
      null,
      that.contractInfo,
      data => {
        that.isSaveBtnLoading = false;
        if (data["code"] == 0) {
          that.message.success("模板保存成功！");
        }
      }
    );
  }

  back() {
    history.back();
  }
}
