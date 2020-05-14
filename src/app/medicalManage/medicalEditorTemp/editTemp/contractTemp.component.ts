/*
 * @Author: dakui.tian
 * @date: Do not edit
 * @LastEditors: dakui.tian
 * @LastEditTime: 2019-09-06 14:53:01
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

  //模板信息
  templateInfo = {
    id: "",
    createDate: "",
    noteTaker: "",
    updateDate: "",
    modifier: "",
    name: "",
    tempMemo: "",
    startStop: 2
  };

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
        that.templateInfo = JSON.parse(infoStr);
        console.log(that.templateInfo);
        let tempMemo = null;
        try {
          tempMemo = JSON.parse(that.templateInfo.tempMemo);
        } catch (error) {
        }
        if (tempMemo !== null && !Utils.isEmpty(tempMemo) && Utils.isArray(tempMemo)) {
          that.templateContent = tempMemo;
        } else {
          this.templateContent = [];
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

    this.templateInfo.tempMemo = JSON.stringify(this.templateContent);
    if (isModifyState) {
      if (isRelease) {
        this.templateInfo.startStop = 1;
      } else {
        this.templateInfo.startStop = 2;
      }
    }
    this.user = this.localStorage.getUser();
    that.templateInfo.modifier = this.user.data.name;
    this.httpReq.post(
      "/disease_template/edit",
      null,
      that.templateInfo,
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
