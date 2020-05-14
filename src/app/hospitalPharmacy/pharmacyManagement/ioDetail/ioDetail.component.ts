import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";
import { GlobalService } from "../../../common/service/GlobalService";
import { NzMessageService } from "ng-zorro-antd";
import { LocalStorage } from "../../../common/service/local.storage";

@Component({
  selector: "app-ioDetail",
  templateUrl: "./ioDetail.component.html",
  styleUrls: ["./ioDetail.component.css"]
})
export class IODetailComponent implements OnInit {
  list = [];

  page = {
    total: 0,
    size: 10,
    index: 1
  };

  reqObj = {
    page: 1,
    size: 10,
    search: "", //药品名称或者拼音首字母
    limitLevel: "", //"限制等级
    drugStatus: "", //药品状态
    drugType: "", //药品类别，
    isExpire: 3, //是否过期
    expireTime: "" //过期时间点
  };

  isTableLoading = false;
  user;//用户信息
  accountId;//用户ID
  isExpireStr = "3";//是否到期
  data;//到期日期
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpReq: HttpReqService,
    private jsUtil: JsUtilsService,
    private globalService: GlobalService,
    private message: NzMessageService,
    private localStorage: LocalStorage //存储
  ) {}

  ngOnInit() {
    this.user = this.localStorage.getUser();
    this.accountId = this.user.data.id;

    if (sessionStorage.getItem(this.router.url) !== null) {
      this.reqObj = JSON.parse(sessionStorage.getItem(this.router.url));
    }
    this.updateList();
  }

  // 库存明细跳转
  turnToStock(data) {
    this.router.navigate(["stock", { data: JSON.stringify(data) }], {
      relativeTo: this.route
    });
  }

  // 获得列表
  updateList(reset: boolean = false): void {
    if (reset) {
      this.page.index = 1;
    }

    this.reqObj.page = this.page.index - 1;
    this.reqObj.size = this.page.size;
    this.reqObj.isExpire = parseInt(this.isExpireStr);
    this.reqObj.expireTime = this.reqObj.expireTime;
    sessionStorage.setItem(this.router.url, JSON.stringify(this.reqObj));

    this.isTableLoading = true;
    this.httpReq.post(
      "med_drug_inventory/listAllInventory",
      null,
      this.reqObj,
      data => {
        this.isTableLoading = false;
        if (data["code"] == 0) {
          this.list = data["data"]["content"];
          this.page.total = data["data"]["totalElements"];
        }
      }
    );
  }

  // 删除
  delete(id) {
    this.globalService.delModal(() => {
      this.httpReq.post(
        "/med_drug/delete",
        null,
        { id: id, accountId: this.accountId },
        data => {
          if (data["code"] == 0) {
            this.message.success("删除成功！");
            this.updateList();
          }
        }
      );
    });
  }

  // 禁用
  forbidden(id, drugStatus) {
    this.httpReq.post(
      "/med_drug/enableDisable",
      null,
      { id: id, accountId: this.accountId },
      data => {
        if (data["code"] == 0) {
          if (drugStatus == "0") {
            this.message.success("启用成功！");
          } else {
            this.message.success("禁用成功！");
          }

          this.updateList();
        }
      }
    );
  }

  //选择到期日期
  onRangerPickerChange(e) {

    this.reqObj.expireTime = this.jsUtil.dateFormat(e, "YYYY-MM-DD  00:00:00");

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
    const oDate2 = new Date(this.reqObj.expireTime);
    if (oDate1.getTime() > oDate2.getTime()) {
      this.message.error("选择的日期应该大于当前日期");
      return;
    }
  }
}
