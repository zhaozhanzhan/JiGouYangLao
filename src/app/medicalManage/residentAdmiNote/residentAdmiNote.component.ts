/*
 * @Author: dakui.tian
 * @date: Do not edit
 * @LastEditors: dakui.tian
 * @LastEditTime: 2019-09-06 15:37:58
 * @Description:
 */
import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { NzMessageService } from "ng-zorro-antd";
import { TagValue } from "./tagValue";
import { HttpReqService } from "../../common/service/HttpUtils.Service";
import { LocalStorage } from "../../common/service/local.storage";
import { ServeConfigService } from "../../common/config/serve-config.service";
import { Utils } from "src/app/common/utils/utils";
@Component({
  selector: "app-residentAdmiNote",
  templateUrl: "./residentAdmiNote.component.html",
  styleUrls: ["./residentAdmiNote.component.css"]
})
export class ResidentAdmiNoteComponent implements OnInit {
  @Input("patientId")
  patientId: string; // 病人ID
  user;
  visible = false; //选择模板的显示
  disabled = true; //显示保存和选择按钮
  isSaveBtnLoading = false;
  //控制标签域是否展开
  isCollapse = false;
  //提供使用的标签列表
  tagArray = TagValue.SupportTag;
  selectedTag = null;

  templateContent = [];

  oldmanInfo;
  constructor(
    private httpReq: HttpReqService, // Http请求服务
    private route: ActivatedRoute,
    private localStorage: LocalStorage,
    private message: NzMessageService,
    private serveConfigService: ServeConfigService,
    private actRoute: ActivatedRoute // 获取传递的参数
  ) { }

  ngOnInit() {
    this.oldmanInfo = JSON.parse(this.actRoute.snapshot.queryParams["data"])["inHospitalInfo"]["basicInfo"];
    this.patientId = JSON.parse(this.actRoute.snapshot.queryParams["data"])[
      "inHospitalInfo"
    ]["id"]; // 传递过来的参数住院参数

    this.user = this.localStorage.getUser(); //获得用户信息
    if (this.user.data.employees.personType == "2") {
      // this.disabled = false;
    }

    this.getInfo();
  }

  getInfo() {
    this.httpReq.post(
      "/admission/list",
      null,
      { inHospital_id: this.patientId },
      data => {
        if (data["code"] == 0) {
          if (data["data"].length > 0) {
            const rest = data["data"][0];
            this.caseTemplateObj.name = rest.admission.name;
            let tempMemo = null;
            try {
              tempMemo = JSON.parse(rest.admission.contractMemo);
            } catch (error) {
            }
            if (tempMemo !== null && !Utils.isEmpty(tempMemo) && Utils.isArray(tempMemo)) {
              this.templateContent = tempMemo;
            } else {
              this.templateContent = [];
            }

            this.caseTemplateObj.id = rest.admission.id;
            if (
              rest.inday == true &&
              this.user.data.employees.personType == "0"
            ) {
              this.disabled = true; //显示保存和选择按钮
            } else {
              this.disabled = false; //显示保存和选择按钮
            }
          }
        }
      }
    );
  }

  caseTemplateObj = {
    inHospital_id: "", //"住院id",
    noteTaker: "", //"记录人",
    id: "", //"病程管理id",
    modifier: "", //"修改人",
    memo: "", //"备注",
    name: "", //"病程名称",
    theType: "", //"模式 1图片 2文本",
    contractMemo: "", //"病程内容"
    oldmanInfo: {}
  };

  // 保存模版
  saveOrEditTemplate() {
    if (this.caseTemplateObj.id == "") {
      this.caseTemplateObj.inHospital_id = this.patientId;
    } else {
      this.caseTemplateObj.inHospital_id = "";
    }

    this.caseTemplateObj.noteTaker = this.user.data.name;
    this.caseTemplateObj.modifier = this.user.data.name;
    this.caseTemplateObj.theType = "2";
    this.caseTemplateObj.contractMemo = JSON.stringify(this.templateContent);
    this.httpReq.post(
      "/admission/saveandedit",
      null,
      this.caseTemplateObj,
      data => {
        if (data["code"] == 0) {
          this.message.success("保存成功");
        }
      }
    );
  }

  back() {
    history.back();
  }

  caseList = []; //模版列表
  // 选择模板
  chooseTemplate() {
    this.visible = true;
    this.httpReq.post("/disease_template/startlist", null, {}, data => {
      if (data["code"] == 0) {
        this.caseList = data["data"];
      }
    });
  }

  // 点击某个病例模版时
  chooseCase(data) {
    this.caseTemplateObj.name = data.name;
    let tempMemo = null;
    try {
      tempMemo = JSON.parse(data.tempMemo);
    } catch (error) {
    }
    if (tempMemo !== null && !Utils.isEmpty(tempMemo) && Utils.isArray(tempMemo)) {
      this.templateContent = tempMemo;
    } else {
      this.templateContent = [];
    }
    this.visible = false;
  }

  close(): void {
    this.visible = false;
  }
}
