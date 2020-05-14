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
  // 保存参数
  obj = {
    id: "", //"抵扣券ID",
    issuingNum: "", //"发行数量",
    remake: "", //"备注",
    accountId: "", //"创建人",
    modifier: "", //"修改人",
    numberRemaining: "", //"剩余数量",
    voucherCode: "", //"抵扣代码",
    voucherName: "", //"抵扣名称",
    useConditions: "", //"使用条件",
    deductionType: "", //"抵扣类型",
    deductibleAmount: "", //"抵扣金额",
    expCategoryId: "", //"抵扣消费类别",
    expItemId: "", //"抵扣消费项目",
    issuingState: "", //"发行状态",
    validityDate: "" //"有效期"
  };

  unit; //抵扣金额的单位
  disabled = false;
  expItemList = []; //获得所有的消费项目；
  expCategoryList = []; //获得所有消费类别
  data; //有效日期
  isabled = true; //消费项目和消费类别显示
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpReq: HttpReqService,
    private message: NzMessageService,
    private localStorage: LocalStorage,
    private jsUtil: JsUtilsService
  ) {}

  ngOnInit() {
    this.getExpItem();
    this.getExpCategory();
    this.disabled = true;
    const dataId = this.route.snapshot.paramMap.get("id");
    if (dataId) {
      this.httpReq.post("Rebate/get", null, { id: dataId }, data => {
        if (data["status"] == 200) {
          const result = data["data"];
          this.obj = result;

          this.changeType();
          this.changeExpItem();
          this.changeItem();
          this.data = result.validityDate;
        }
      });
    }
  }
  // 抵扣类型发生变化时
  changeType() {
    if (this.obj.deductionType == "1") {
      this.unit = "元";
    } else {
      this.unit = "%";
    }
  }
  //使用条件选择
  changeItem() {
    if (this.obj.useConditions == "1") {
      this.isabled = false;
    } else {
      this.isabled = true;
    }
  }
  // 获得所有的消费项目
  getExpItem() {
    this.httpReq.post("expItem/listAll", null, null, data => {
      if (data["code"] == 0) {
        this.expItemList = data["data"];
      }
    });
  }

  // 通过消费类别ID获得消费项目
  changeExpItem() {
    this.httpReq.post(
      "expItem/listByExpCategoryId",
      null,
      { id: this.obj.expCategoryId },
      data => {
        if (data["code"] == 0) {
          this.expItemList = data["data"];
        }
      }
    );
  }
  // 获得所有的消费类别
  getExpCategory() {
    this.httpReq.post("expCategory/listAll", null, null, data => {
      if (data["code"] == 0) {
        this.expCategoryList = data["data"];
      }
    });
  }
  back() {
    history.back();
  }
}
