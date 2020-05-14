/*
 * @Author: dakui.tian
 * @date: Do not edit
 * @LastEditors: dakui.tian
 * @LastEditTime: 2019-08-22 17:41:48
 * @Description:
 */
import { Utils } from "../../../common/utils/utils";
import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { NzMessageService, NzModalService } from "ng-zorro-antd";
import { LocalStorage } from "../../../common/service/local.storage";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";
@Component({
  selector: "app-info",
  templateUrl: "./info.component.html",
  styleUrls: ["./info.component.scss"]
})
export class InfoComponent implements OnInit {
  // 保存时参数
  saveObj = {
    oldManId: "", //"老人ID",
    chargeMode: "", //"收费方式",
    feeMode: "", //"计费方式",
    remark: "", //"备注",
    consumptionTime: "", //"消费时间",
    expItemId: "", //"消费项目id",
    expCategoryId: "", //"消费类别id",
    costMoney: 0, //"消费金钱",
    costQuantity: 1, //"消费数量",
    consumerRegistrationId: "", //扣款账目
    consumerRegistrationName: "", //扣款账目名称
    unitPrice: 0, //"单价"
    specs: "", //"规格"
    couponD: "", //"抵扣券ID",
    couponB: "", //"补价券id"}
    deductibleAmount: 0, //抵扣金额
    supplementAmount: 0, //补价金额
    deductionType: "", //抵扣类型
    supplementType: "" //补价类型
  };

  // 老人的基本信息
  oldManObjInfo = {
    name: "", //"老人姓名",
    sex: "", //"性别",
    age: "", //"年龄",
    cardno: "", //"身份证",
    roomName: "", //"房间号",
    inDate: "", //"入院日期",
    days: "", //"住院天数",
    accountsName: "", //"缴存账目",
    accountBalance: "", //"缴存账目余额",
    accountTotal: "" //"缴存账目累计缴存",
  };
  disabled = false;
  accountList = []; //账目列表
  rebateList = []; //抵扣劵
  couponsList = []; //补加劵
  id;
  settlementStatus;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpReq: HttpReqService,
    private message: NzMessageService,
    private localStorage: LocalStorage,
    private jsUtil: JsUtilsService,
    private modalService: NzModalService
  ) {}

  ngOnInit() {
    const dataId = this.route.snapshot.paramMap.get("id");
    this.id = dataId;
    if (dataId) {
      this.httpReq.post(
        "consumption/consumptionDetails",
        null,
        { id: dataId },
        data => {
          if (data["code"] == 0) {
            const result = data["data"];

            this.oldManObjInfo.name = result.name;
            this.oldManObjInfo.sex = result.sex;
            this.oldManObjInfo.age = result.age;
            this.oldManObjInfo.cardno = result.cardno;
            this.oldManObjInfo.roomName = result.roomName;
            this.oldManObjInfo.inDate = result.inDate;
            this.oldManObjInfo.days = result.days;
            this.accountList = result.consumerRegistration;
            this.saveObj.expCategoryId =
              result.consumption.expItem.expCategoryInfo.name;
            this.saveObj.expItemId = result.consumption.expItem.itemName;
            this.saveObj.consumptionTime = result.consumption.consumptionTime;
            if (result.consumption.chargeMode == "1") {
              this.saveObj.chargeMode = "现结";
            } else if (result.consumption.chargeMode == "2") {
              this.saveObj.chargeMode = "代扣";
            } else {
              this.saveObj.chargeMode = "";
            }
            this.saveObj.consumerRegistrationId =
              result.consumption.expItem.depositAccountsInfo.accountsName;
<<<<<<< HEAD
=======
            this.saveObj.consumerRegistrationName =
              result.consumption.expItem.depositAccountsInfo.accountsName;
>>>>>>> 9dda0dbaf712eacbb8cb0d8e4c2d5c50444fbe68
            this.saveObj.feeMode = result.consumption.feeMode;
            this.saveObj.costQuantity = result.consumption.costQuantity;
            this.saveObj.unitPrice = result.consumption.expItem.unitPrice;
            this.saveObj.specs = result.consumption.expItem.specs;
            this.saveObj.couponD = result.consumption.couponD;
            this.saveObj.couponB = result.consumption.couponB;
            this.saveObj.costMoney = result.consumption.costMoney;
            this.saveObj.remark = result.consumption.remark;
            this.settlementStatus = result.consumption.settlementStatus;
            this.disabled = true;
          }
        }
      );
    }
  }

  // 取消消费
  cancel() {
    this.modalService.confirm({
      nzTitle: "请确认是否取消?",
      nzOkText: "确认",
      nzOkType: "danger",
      nzOnOk: () => {
        this.httpReq.post(
          "consumption/consumptionCancel",
          null,
          { id: this.id },
          data => {
            if (data["code"] == 0) {
              this.message.success("取消成功");
              this.back();
            }
          }
        );
      },
      nzCancelText: "取消",
      nzOnCancel: () => {}
    });
  }
  back() {
    history.back();
  }
}
