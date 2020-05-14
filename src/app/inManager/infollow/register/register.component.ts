import { Component, OnInit, Input } from "@angular/core";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { Router, ActivatedRoute } from "@angular/router";
import { NzMessageService, MentionOnSearchTypes } from "ng-zorro-antd";
import { NzModalService } from "ng-zorro-antd";
import { InfollowService } from "../infollow.service";
import * as _ from "underscore";
import { InputTemplateComponent } from "src/app/common/input-template/input-template.component";
@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"]
})
export class RegisterComponent implements OnInit {
  // 老人id
  @Input() id;
  @Input() everydayComponent;
  @Input() sumComponent;
  // 老人信息
  olderIndo;
  //  修改老人基本信息
  sendData = {
    // 基本信息
    name: "",
    status: "",
    sex: "",
    age: "",
    inDate: "",
    room: "",
    levelOfCare: "",
    messageId: "", // 登记详情ID
    contagion: "", // 传染病
    contagion2: "", // 传染病2
    allergic: "", // 过敏史
    allergic2: [
      { label: "青霉素类", value: "青霉素类" },
      { label: "庆大霉素类", value: "庆大霉素类" },
      { label: "磺胺类", value: "磺胺类" },
      { label: "其他（注明）", value: "其他（注明）" }
    ], // 过敏史2
    allergic3: "", // 过敏史3
    historyOfNow: "", // 病史（对应健康情况中的现病史）
    takingMeds: [], // 正在使用的药物
    remark: '', // 备注
  }
  
  loading: boolean = false; // loading
  otherInput: boolean = false; // 过敏史输入框是否可见

  //=====================药品选择相关=========================//
  medNameList: Array<Object> = []; // 药品名称列表
  inputSuggestLoading = false; // 药品搜索loading
  timer;
  listOfUsages = [
    // 用法选项
    { label: "口服", value: "1" },
    { label: "肌注", value: "2" },
    { label: "静脉注射/点滴", value: "3" },
    { label: "舌下", value: "4" },
    { label: "肛门给药", value: "5" },
    { label: "皮下注射", value: "6" },
    { label: "外用", value: "7" },
    { label: "吸入", value: "8" }
  ];
  listOfFrequency = [
    // 频率选项
    { label: "prn(需要时使用)", value: "prn(需要时使用)" },
    { label: "qh 每小时1次", value: "qh 每小时1次" },
    { label: "q2h 每小时2次", value: "q2h 每小时2次" },
    { label: "qd 每日1次", value: "qd 每日1次" },
    { label: "bid 每日2次", value: "bid 每日2次" },
    { label: "tid 每次3次", value: "tid 每次3次" },
    { label: "qcd 每2日1次", value: "qcd 每2日1次" },
    { label: "qw 每周1次", value: "qw 每周1次" }
  ];

  //==========================================================//

  constructor(
    private message: NzMessageService,
    private router: Router,
    private route: ActivatedRoute,
    public httpReq: HttpReqService,
    private entrustService: InfollowService,
    private modalService: NzModalService
  ) {}

  ngOnInit() {
    // 获取老人详情
    this.getOlderInfo();
  }

  // 选择药品辅助方法
  selMedName(value, index) {
    this.sendData.takingMeds[index].drugsAndDosage = value;
  }
  // 选择药品辅助方法
  profix(el: HTMLElement) {
    el.click();
  }

  // 获取老人详情
  getOlderInfo() {
    if (!this.id) {
      console.log("获取老人id失败！");
      return;
    }
    this.loading = true;
    this.httpReq.post(
      "rtDwell/getDwellMessage",
      null,
      { id: this.id },
      data => {
        this.loading = false;
        if (data.code == 0) {
          this.olderIndo = data["data"];
          try {
            this.olderIndo["allergic2"] = JSON.parse(
              this.olderIndo["allergic2"]
            );
            this.olderIndo["takingMeds"] =
              this.olderIndo["takingMeds"]["length"] > 0
                ? JSON.parse(this.olderIndo["takingMeds"])
                : [];
            if (
              this.olderIndo["takingMeds"] instanceof Array &&
              this.olderIndo["takingMeds"]["length"] > 0
            ) {
              this.olderIndo["takingMeds"].forEach(element => {
                if (element["drugsAndDosage"] instanceof Array) {
                  element["drugsAndDosage"] = element["drugsAndDosage"][0];
                }
              });
            }
            console.log(this.olderIndo);
            _.extend(this.sendData, this.olderIndo);
          } catch (error) {
            console.log(error);
          }
        }
      }
    );
  }

  // 传染病 radio 回调
  contagion(value, el: HTMLElement) {
    if (value == "否") {
      this.sendData.contagion2 = "";
    } else if (value == "是") {
      setTimeout(function() {
        el.focus();
      }, 100);
    }
  }

  // 过敏史 radio 回调
  allergic(value) {
    if (value == "否") {
      this.sendData.allergic2.forEach((item: Object) => {
        if (item.hasOwnProperty("checked")) delete item["checked"];
      });
      this.sendData.allergic3 = "";
    }
  }
  // 过敏史 checkbox 回调 返回值仅用于后面的input框可否输入
  allergic2(checkList: Array<Object>, el: HTMLElement) {
    console.log(checkList);
    if (
      checkList.some(item => {
        return item["value"] == "其他（注明）" && item["checked"];
      })
    ) {
      setTimeout(function() {
        el.focus();
      }, 100);
      this.otherInput = false;
    } else {
      this.sendData.allergic3 = "";
      this.otherInput = true;
    }
  }

  // 搜索老人输入回调
  onSearchNameChange({ value }: MentionOnSearchTypes, index) {
    // if(!name) return;
    let that = this;
    that.inputSuggestLoading = true;
    clearTimeout(that.timer);
    return (function() {
      that.timer = setTimeout(function() {
        that.entrustService.getMedName.call(
          that,
          that.sendData.takingMeds[index].drugsAndDosage,
          function(data) {
            if (data.code == 0) {
              // that.medNameList = data['data']['content'];
              that.medNameList = [];
              let mednamelist = data["data"];
              if (mednamelist instanceof Array && mednamelist.length) {
                mednamelist.forEach((item, index) => {
                  // that.medNameList[index] = item[]
                  if (item["name"]) that.medNameList[index] = item["name"];
                });
                // console.log(that.medNameList);
              }
            }
            that.inputSuggestLoading = false;
          }
        );
      }, 300);
    })();
  }
  // 删除药品
  deleteMed(index) {
    this.sendData.takingMeds.splice(index, 1);
  }
  // 添加药品
  addMed() {
    for (let i = 0; i < this.sendData.takingMeds.length; i++) {
      const element = this.sendData.takingMeds[i];
      if (!element["drugsAndDosage"]) {
        this.message.error(
          `第${i + 1}条药品名称为空，请填写完善后再添加药品！`
        );
        return;
      }
    }
    this.sendData.takingMeds.push({
      drugsAndDosage: "",
      usage: "",
      perUse: "",
      frequency: "",
      comment: ""
    });
  }

  // 保存
  saveForm() {
    let num: number;
    if (
      this.sendData.takingMeds.some((item, index) => {
        if (item["drugsAndDosage"].length < 1) num = index;
        return item["drugsAndDosage"].length < 1;
      })
    ) {
      this.message.error(
        `服用药品列表序号 ${num + 1} 药品名称为空，请完善后再保存`
      );
      return;
    }
    this.loading = true;
    this.httpReq.post("rtDwell/dwellMessageSave", null, this.sendData, data => {
      this.loading = false;
      if (data.code == 0) {
        this.message.success("保存成功！");
      }
    });
  }

  // 放弃
  dropForm() {
    if (!this.sendData["messageId"]) {
      console.log("获取登记详情ID失败");
      return;
    }
    let messageId = this.sendData["messageId"];
    this.modalService.confirm({
      nzTitle: `确认放弃操作？`,
      nzOnOk: () => {
        this.loading = true;
        this.httpReq.post(
          "rtDwell/dwellMessageDel",
          null,
          { messageId: messageId },
          data => {
            this.loading = false;
            if (data.code == 0) {
              this.message.success("操作成功！");
              this.ngOnInit();
              this.everydayComponent.ngOnInit();
              this.sumComponent.ngOnInit();
            }
          }
        );
      }
    });
  }
}
