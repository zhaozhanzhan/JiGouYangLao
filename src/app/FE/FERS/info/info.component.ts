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
    id: "", //"增补券ID",
    remake: "", //"备注",
    accountId: "", //"创建人",
    modifier: "", //"修改人",
    supplementCode: "", //"增补券代码",
    supplementName: "", //"增补券名称",
    useConditions: "", //"使用条件",
    supplementType: "", //"增补类型",
    supplementAmount: "", //"增补金额",
    supplementCategory: "", //"增补消费类别",
    supplementItems: "", //"增补消费项目",
    issuingState: "" //"发行状态"
  };
  disabled = false; //是否可编辑
  unit; //抵扣金额的单位

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
    const dataId = this.route.snapshot.paramMap.get("id");
    if (dataId) {
      this.httpReq.post("supplementCoupons/get", null, { id: dataId }, data => {
        if (data["status"] == 200) {
          this.obj = data["data"];
          this.disabled = true;
          this.changeType();
          this.changeItem();
        }
      });
    }
  }
  // 抵扣类型发生变化时
  changeType() {
    if (this.obj.supplementType == "1") {
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
  back() {
    history.back();
  }
}
