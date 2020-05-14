/*
 * @Author: dakui.tian
 * @date: Do not edit
 * @LastEditors: dakui.tian
 * @LastEditTime: 2019-08-27 10:52:38
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
  selector: "app-add",
  templateUrl: "./add.component.html",
  styleUrls: ["./add.component.scss"]
})
export class AddComponent implements OnInit {
  // 保存参数
  obj = {
    id: "", //"抵扣券ID",
    issuingNum: "", //"发行数量",
    remark: "", //"备注",
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

  saveLoading = false; //保存加载状态
  disabled = false; //是否可编辑
  unit; //抵扣金额的单位
  user; //用户信息
  expItemList = []; //获得所有的消费项目；
  expCategoryList = []; //获得所有消费类别
  data; //有效日期
  isabled = true; //消费项目和消费类别显示
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private localStorage: LocalStorage,
    private httpReq: HttpReqService,
    private message: NzMessageService,
    private jsUtil: JsUtilsService
  ) {}

  ngOnInit() {
    this.user = this.localStorage.getUser();
    this.obj.accountId = this.user.data.id;
    // this.getExpItem();
    this.getExpCategory();
    this.changeExpItem();
    const dataId = this.route.snapshot.paramMap.get("id");
    if (dataId) {
      this.httpReq.post("Rebate/get", null, { id: dataId }, data => {
        if (data["status"] == 200) {
          const result = data["data"];
          if (result.expCategoryId == null) {
            result.expCategoryId = "";
          }
          this.obj = result;
          this.changeType();
          this.changeExpItem();
          this.changeItem();
          this.obj.modifier = this.user.data.id;
          this.data = result.validityDate;
        }
      });
    }
  }

  // 保存
  save() {
    if (this.obj.issuingNum < this.obj.numberRemaining) {
      this.message.error("发行数量不可以小于剩余数量");
      return;
    }

    if (this.obj.voucherName == "") {
      this.message.error("抵扣券名称不能为空");
      return;
    }

    if (this.obj.useConditions == "") {
      this.message.error("使用条件不能为空");
      return;
    }

    if (this.obj.useConditions == "2") {
      if (this.obj.expCategoryId == "") {
        this.message.error("抵扣消费类别不能为空");
        return;
      }
    }

    if (this.obj.issuingState == "") {
      this.message.error("发行状态不能为空");
      return;
    }

    this.obj.validityDate = this.obj.validityDate;
    this.saveLoading = true;
    this.httpReq.post("Rebate/saveOrUpdate", null, this.obj, data => {
      this.saveLoading = false;
      if (data["status"] == 200) {
        this.message.success("保存成功！");
        this.back();
      }
    });
  }
  //使用条件选择
  changeItem() {
    if (this.obj.useConditions == "1") {
      this.isabled = false;
    } else {
      this.isabled = true;
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

  // // 获得所有的消费项目
  // getExpItem() {
  //   this.httpReq.post("expItem/listAll", null, null, data => {
  //     if (data["code"] == 0) {
  //       this.expItemList = data["data"];
  //     }
  //   });
  // }

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
  // 返回
  back() {
    history.back();
  }

  onRangerPickerChange(e) {
    this.obj.validityDate = this.jsUtil.dateFormat(e, "YYYY-MM-DD  00:00:00");
    // 获得今天得日期
    const data = new Date();
    let year = data.getFullYear();
    let month = data.getMonth() + 1;
    let day = data.getDate();
    let monthStr;
    let dayStr;
    if (month < 10) {
      monthStr = "0" + month;
    } else {
      monthStr = "" + month;
    }
    if (day < 10) {
      dayStr = "0" + day;
    } else {
      dayStr = "" + day;
    }
    const fullYear = year + "-" + monthStr + "-" + dayStr;
    const oDate1 = new Date(fullYear);
    const oDate2 = new Date(this.obj.validityDate);
    if (oDate1.getTime() > oDate2.getTime()) {
      this.message.error("选择的日期应该大于当前日期");
      return;
    }
  }
}
