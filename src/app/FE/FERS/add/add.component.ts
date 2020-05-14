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

@Component({
  selector: "app-add",
  templateUrl: "./add.component.html",
  styleUrls: ["./add.component.scss"]
})
export class AddComponent implements OnInit {
  // 保存参数
  obj = {
    id: "", //"增补券ID",
    remark: "", //"备注",
    accountId: "", //"创建人",
    modifier: "", //"修改人",
    supplementCode: "", //"增补券代码",
    supplementName: "", //"增补券名称",
    useConditions: "", //"使用条件",
    supplementType: "", //"增补类型",
    supplementAmount: "", //"增补金额",
    expCategoryId: "", //"抵扣消费类别",
    expItemId: "", //"抵扣消费项目",
    issuingState: "" //"发行状态"
  };

  saveLoading = false; //保存加载状态
  disabled = false; //是否可编辑
  unit; //抵扣金额的单位
  user; //用户信息
  expItemList = []; //获得所有的消费项目；
  expCategoryList = []; //获得所有消费类别
  isabled = true; //消费项目和消费类别显示
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private localStorage: LocalStorage,
    private httpReq: HttpReqService,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    this.user = this.localStorage.getUser();
    this.obj.accountId = this.user.data.id;
    this.getExpCategory();
    this.changeExpItem();
    const dataId = this.route.snapshot.paramMap.get("id");
    if (dataId) {
      this.httpReq.post("supplementCoupons/get", null, { id: dataId }, data => {
        this.saveLoading = false;
        if (data["status"] == 200) {
          const result = data["data"];
          if (result.expCategoryId == null) {
            result.expCategoryId = "";
          }
          this.obj = data["data"];
          this.changeType();
          this.changeExpItem();
          this.changeItem();

          this.obj.modifier = this.user.data.id;
        }
      });
    }
  }

  // 保存
  save() {
    if (this.obj.supplementCode == "") {
      this.message.error("补价券代码不能为空");
      return;
    }
    if (this.obj.supplementName == "") {
      this.message.error("补价券名称不能为空");
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

    if (this.obj.supplementAmount == "") {
      this.message.error("补价金额不能为空");
      return;
    }
    if (this.obj.issuingState == "") {
      this.message.error("发行状态不能为空");
      return;
    }
    this.saveLoading = true;
    this.httpReq.post(
      "supplementCoupons/saveOrUpdate",
      null,
      this.obj,
      data => {
        this.saveLoading = false;
        if (data["status"] == 200) {
          this.message.success("保存成功！");
          this.back();
        }
      }
    );
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
    if (this.obj.supplementType == "1") {
      this.unit = "元";
    } else {
      this.unit = "%";
    }
  }

  // 获得所有的消费项目
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
}
