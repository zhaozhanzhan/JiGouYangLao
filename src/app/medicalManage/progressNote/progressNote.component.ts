/*
 * @Author: dakui.tian
 * @date: Do not edit
 * @LastEditors: dakui.tian
 * @LastEditTime: 2019-09-06 16:03:22
 * @Description:
 */
import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { NzMessageService } from "ng-zorro-antd";
import { TagValue } from "./tagValue";
import { HttpReqService } from "../../common/service/HttpUtils.Service";
import { LocalStorage } from "../../common/service/local.storage";
import { ServeConfigService } from "../../common/config/serve-config.service";
import { Utils } from "src/app/common/utils/utils";

import { GlobalService } from "../../common/service/GlobalService";
@Component({
  selector: "app-progressNote",
  templateUrl: "./progressNote.component.html",
  styleUrls: ["./progressNote.component.css"]
})
export class ProgressNoteComponent implements OnInit {
  @Input("patientId")
  patientId: string; // 病人ID
  user;
  visible = false; //选择模板的显示
  progressIsVisible = false; //所有的病程弹出框显示
  isSaveBtnLoading = false;
  disabled = true; //编辑器是可以编辑还是可以只读得
  templateVisible = true; //选择模板
  addVisible = false; //添加病程
  deleteVisible = false; //删除当前
  temporaryVisible = true; //暂存病例
  accomplishVisible = true; //完成病例
  id = ""; //病程ID
  caseObj = {
    name: "",
    value: []
  }; //绑定得选择病例
  // 病程管理保存参数
  courseMegeObj = {
    inHospital_id: "", //"住院id",
    noteTaker: "", //"记录人",
    id: "", //"病程管理id",
    modifier: "", //"修改人",
    memo: "", //"备注",
    name: "", //"病程名称",
    status: "", //"状态 1暂存 2完成",
    theType: "", //"模式 1图片 2文本",
    contractMemo: "" //"病程内容"
  };

  //控制标签域是否展开
  isCollapse = false;
  //提供使用的标签列表
  tagArray = TagValue.SupportTag;
  selectedTag = null;

  templateContent = [];
  oldmanInfo;

  @ViewChild("ckEditor")
  ckeditor: any;
  caseTemplateObj = {
    inHospital_id: "", //"住院id",
    noteTaker: "", //"记录人",
    id: "", //"病程管理id",
    modifier: "", //"修改人",
    memo: "", //"备注",
    name: "", //"病程名称",
    theType: "", //"模式 1图片 2文本",
    status: "", //状态 1暂存 2完成
    contractMemo: "" //"病程内容"
  };
  constructor(
    private httpReq: HttpReqService, // Http请求服务
    private route: ActivatedRoute,
    private localStorage: LocalStorage,
    private message: NzMessageService,
    private serveConfigService: ServeConfigService,
    private actRoute: ActivatedRoute, // 获取传递的参数
    private globalService: GlobalService
  ) { }

  ngOnInit() {
    this.oldmanInfo = JSON.parse(this.actRoute.snapshot.queryParams["data"])["inHospitalInfo"]["basicInfo"];
    this.patientId = JSON.parse(this.actRoute.snapshot.queryParams["data"])[
      "inHospitalInfo"
    ]["id"]; // 传递过来的参数住院参数
    this.user = this.localStorage.getUser(); //获得用户信息
    this.getAllCourseList();
    if (this.user.data.employees.personType == '0') {
      this.getNameList();//获得医生下所有的病人的姓名
    }

  }

  nameList = [];//病人的姓名
  // 姓名下拉
  getNameList() {
    this.httpReq.post(
      "/long_term_orders/listOldManByDor",
      null,
      { accountId: this.user.data.id },
      data => {
        if (data["code"] == 0) {
          this.nameList = data['data'];
        } else {
          this.message.error(data["message"]);
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

  // 保存模版
  saveOrEditTemplate(value) {
    this.caseTemplateObj.inHospital_id = this.patientId;
    // if (this.caseTemplateObj.id == "") {
    //   this.caseTemplateObj.inHospital_id = this.patientId;
    // } else {
    //   this.caseTemplateObj.inHospital_id = "";
    // }
    this.caseTemplateObj.status = value;
    this.caseTemplateObj.noteTaker = this.user.data.name;
    this.caseTemplateObj.modifier = this.user.data.name;
    this.caseTemplateObj.theType = "2";
    this.caseTemplateObj.contractMemo = JSON.stringify(this.templateContent);

    this.caseTemplateObj.id = this.bcId;

    if (this.caseTemplateObj.name == "" || this.caseTemplateObj.contractMemo == "") {

      this.message.error("请填写病程名称或病程内容");
      return;
    }
    this.httpReq.post(
      "/course_disease/saveandedit",
      null,
      this.caseTemplateObj,
      data => {
        if (data["code"] == 0) {
          this.bcId = data['data']['id'];
          this.message.success("保存成功");
          if (this.caseTemplateObj.status == "2") {
            this.disabled = false; //编辑器不可以修改
            this.addVisible = true; //有添加按钮
            this.deleteVisible = false; //没有删除按钮
            this.temporaryVisible = false; //没有暂存按钮
            this.accomplishVisible = false; //没有完成按钮
            this.templateVisible = false; //选择模版
          }
        }
      }
    );
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

  //删除当前病例
  deleTemplate() {
    this.globalService.delModal(() => {
      this.httpReq.post("/course_disease/del", null, { id: this.id }, data => {
        if (data["code"] == 0) {
          this.message.success("删除成功");
          this.getAllCourseList();
        }
      });
    });
  }
  bcId = "";
  // 获得所有得病程列表
  courseAllList = []; //所有的病程列表
  getAllCourseList() {
    this.httpReq.post(
      "/course_disease/list",
      null,
      { inHospital_id: this.patientId },
      data => {
        if (data["code"] == 0) {
          this.courseAllList = data["data"];
          console.log('tag', this.courseAllList)
          if (this.courseAllList.length > 0) {
            const result = this.courseAllList[0];
            this.caseTemplateObj.name = result.name;

            let tempMemo = null;
            try {
              tempMemo = JSON.parse(result.contractMemo);
            } catch (error) {
            }
            if (tempMemo !== null && !Utils.isEmpty(tempMemo) && Utils.isArray(tempMemo)) {
              this.templateContent = tempMemo;
            } else {
              this.templateContent = [];
            }

            this.id = result.id;
            this.caseTemplateObj.id = result.id;
            if (result.status == "1") {
              //如果是暂存状态，没有添加按钮
              this.addVisible = false;
              this.deleteVisible = true; //删除按钮
              this.temporaryVisible = true; //暂存按钮
              this.accomplishVisible = true; //完成按钮
              this.disabled = true; //编辑器可以修改
              this.templateVisible = true; //选择模版
              this.bcId = result.id; //病程ID
            } else if (result.status == "2") {
              //如果是完成状态，没有暂存，完成，选择模版，删除当前，不可以编辑
              this.disabled = false; //编辑器不可以修改
              this.addVisible = true; //有添加按钮
              this.deleteVisible = false; //没有删除按钮
              this.temporaryVisible = false; //没有暂存按钮
              this.accomplishVisible = false; //没有完成按钮
              this.templateVisible = false; //选择模版
              this.bcId = result.id; //病程ID
            }
          }
        }
      }
    );
  }

  // 点击添加病程
  addTemplate() {
    this.caseTemplateObj.name = "";
    this.templateContent = [];
    this.bcId = "";
    this.addVisible = false;
    this.templateVisible = true; //选择模版
    this.disabled = true; //编辑器可以修改
    this.temporaryVisible = true; //暂存按钮
    this.accomplishVisible = true; //完成按钮
  }

  close(): void {
    this.visible = false;
  }

  //查看所有的病程
  getAllProgress() {
    this.progressIsVisible = true;
    this.getAllCourseList();
  }

  provinceChange(e) {

    let tempMemo = null;
    try {
      tempMemo = JSON.parse(this.caseObj.name);
    } catch (error) {
    }
    if (tempMemo !== null && !Utils.isEmpty(tempMemo) && Utils.isArray(tempMemo)) {
      this.caseObj.value = tempMemo;
    } else {
      this.caseObj.value = [];
    }

    console.log('tag', this.caseObj);
  }

  historyAdviceObj = {
    name: "", //"病人姓名或住院号",
    accountId: "", //"登陆账户Id"
    page: 0,
    size: 10
  };
  historyAdviceList = []; //历史医嘱列表
  caseTotalPages: 0; //历史病历总页数
  isShowHistoryAdvice = false; //查看历史医嘱显示
  // 显示查看历史医嘱弹出内容
  checkHistoryAdvice() {
    this.isShowHistoryAdvice = true;
    this.historyAdviceObj.accountId = this.user.data.id;
    this.historyAdviceObj.page = 0;
    // 获得历史医嘱数据
    this.httpReq.post(
      "/course_disease/listCopy",
      null,
      this.historyAdviceObj,
      data => {
        if (data["code"] == 0) {
          this.historyAdviceList = data["data"]["content"];
          this.caseTotalPages = data["data"]["totalPages"];
        } else {
          this.message.error(data["message"]);
        }
      }
    );
  }

  // 导入医嘱
  importHistoryAdvice(data) {
    console.log(data);
    // 获得当前的日期和时间
    this.caseTemplateObj.name = data.name;

    let tempMemo = null;
    try {
      tempMemo = JSON.parse(data.contractMemo);
    } catch (error) {
    }
    if (tempMemo !== null && !Utils.isEmpty(tempMemo) && Utils.isArray(tempMemo)) {
      this.templateContent = tempMemo;
    } else {
      this.templateContent = [];
    }

  }

  // 关闭查看历史医嘱弹出框
  closeHistoryAdvice() {
    this.isShowHistoryAdvice = false;
  }

  loadMoreCase() {
    this.isShowHistoryAdvice = true;
    this.historyAdviceObj.accountId = this.user.data.id;
    this.historyAdviceObj.page += 1;
    this.httpReq.post(
      "/course_disease/listCopy",
      null,
      this.historyAdviceObj,
      data => {
        if (data["code"] == 0) {
          this.historyAdviceList = this.historyAdviceList.concat(
            data["data"]["content"]
          );
          this.caseTotalPages = data["data"]["totalPages"];
        } else {
          this.message.error(data["message"]);
        }
      }
    );
  }
}
