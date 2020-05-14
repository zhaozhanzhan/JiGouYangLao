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
import { NzMessageService } from "ng-zorro-antd";
import { LocalStorage } from "../../../common/service/local.storage";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";
@Component({
  selector: "app-info",
  templateUrl: "./info.component.html",
  styleUrls: ["./info.component.scss"]
})
export class InfoComponent implements OnInit {
  templateContent = [];

  //保存合同按钮的状态
  saveBtnLoading = false;

  saveContractParams = {
    id: "",
    oldman_id: "",
    noteTaker: "",
    name: "",
    signDate: "",
    effectDate: "",
    invalidDate: "",
    theType: "",
    contractMemo: "",
    oldman: {
      id: "",
      name: "",
      oldmanUrl: "",
      sex: "",
      birthYearMonth: "",
      cardno: "",
      inDate: "",
      medicalPayment: "",
      medicalPaymentMemo: "",
      personnelSortMemo: "",
      personnelSort: "",
      phone: ""
    },
    memo: ""
  };
  contractOutData = {
    signDate: "",
    effectDate: "",
    invalidDate: "",
    govSign1: "",
    govSign2: "",
    govSign3: "",
    relationSign1: "",
    relationSign2: ""
  };

  //是否是编辑模式
  isModifyMode = false;

  dateFormat = "yyyy-MM-dd";

  // 合同图片模式保存的地址
  public dischargeUrls = "";

  user;

  @ViewChild("contractImg")
  contractImg: any;

  @ViewChild("ShowView")
  ShowView: any;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpReq: HttpReqService,
    private message: NzMessageService,
    private localStorage: LocalStorage,
    private jsUtil: JsUtilsService
  ) { }

  ngOnInit() {
    let that = this;
    this.route.params.subscribe((params: Params) => {
      const infoStr = params["info"];
      if (infoStr != "{}") {
        that.saveContractParams = JSON.parse(infoStr);
        if (that.saveContractParams.theType == "1") {
          that.dischargeUrls = that.saveContractParams.contractMemo;
        } else if (that.saveContractParams.theType == "2") {
          try {
            that.templateContent = JSON.parse(that.saveContractParams.memo)
          } catch (error) { }
        }
      } else {
        that.message.error("数据传递错误，请重试！");
        history.back();
      }
    });
  }

  backToList() {
    history.back();
  }

  /**
   * 保存合同到服务器
   */
  saveContract() {
    this.user = this.localStorage.getUser();
    this.saveContractParams.noteTaker = this.user.data.name;
    if (this.saveContractParams.theType == "1") {
      this.saveContractParams.contractMemo = this.contractImg.showImageUrls.toString();
    } else if (this.saveContractParams.theType == "2") {
    }

    this.saveContractParams.signDate = this.jsUtil.dateFormat(
      this.saveContractParams.signDate,
      "YYYY-MM-DD  00:00:00"
    );
    this.saveContractParams.effectDate = this.jsUtil.dateFormat(
      this.saveContractParams.effectDate,
      "YYYY-MM-DD  00:00:00"
    );
    this.saveContractParams.invalidDate = this.jsUtil.dateFormat(
      this.saveContractParams.invalidDate,
      "YYYY-MM-DD  00:00:00"
    );
    this.saveContractParams.memo = JSON.stringify(this.templateContent);

    let that = this;
    that.saveBtnLoading = true;
    let param = this.httpReq.post(
      "contract/edit",
      null,
      this.saveContractParams,
      data => {
        that.saveBtnLoading = false;
        if (data["status"] == 200) {
          that.message.success("保存成功！");
          that.back();
        }
      }
    );
  }

  back() {
    history.back();
  }
}
