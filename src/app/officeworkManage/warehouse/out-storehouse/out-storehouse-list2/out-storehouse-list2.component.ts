import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Utils } from "../../../../common/utils/utils";
import { LocalStorage } from "../../../../common/service/local.storage";
import { HttpReqService } from "../../../../common/service/HttpUtils.Service";
import { JsUtilsService } from "../../../../common/service/JsUtils.Service";

@Component({
  selector: "app-out-storehouse-list2",
  templateUrl: "./out-storehouse-list2.component.html",
  styleUrls: ["./out-storehouse-list2.component.css"]
})
export class OutStorehouseList2Component implements OnInit {
  list = [];

  page = {
    total: 0,
    size: 10,
    index: 1
  };

  reqObj = {
    page: 1,
    size: 10,
    whId: "",
    whCategoryOutId: "",
    whGoodsId: "",
    receiver: "",
    btime: "",
    etime: "",
    accountId: ""
  };

  isTableLoading = false;

  userInfo;

  selectedDates = [];
  storehouseList = [];
  whCategoryOutList = [];
  goodsList = [];

  index = 0;

  constructor(
    private router: Router,
    private httpReq: HttpReqService,
    private jsUtil: JsUtilsService,
    private localStroage: LocalStorage
  ) {}

  ngOnInit() {
    let userInfoData: any = this.localStroage.getUser();
    this.userInfo = userInfoData.data;
    this.reqObj.accountId = this.userInfo.id;
    if (sessionStorage.getItem(this.router.url + "2") !== null) {
      this.reqObj = JSON.parse(sessionStorage.getItem(this.router.url + "2"));
      if (
        !Utils.isEmpty(this.reqObj.btime) &&
        !Utils.isEmpty(this.reqObj.etime)
      ) {
        this.selectedDates.push(new Date(this.reqObj.btime));
        this.selectedDates.push(new Date(this.reqObj.etime));
      }
    }

    // 获得出库库房
    this.httpReq.post(
      "/warehouse/listAllByAccount",
      null,
      { accountId: this.userInfo.id },
      data => {
        if (data["status"] == 200 && data["code"] == 0) {
          this.storehouseList = data["data"];
        }
      }
    );

    // 获得出库方式
    this.httpReq.post("outWarehouseCategory/listAll", null, {}, data => {
      if (data["status"] == 200 && data["code"] == 0) {
        this.whCategoryOutList = data["data"];
      }
    });

    // 获得出库物品
    this.httpReq.post("goods/listAll", null, {}, data => {
      if (data["status"] == 200 && data["code"] == 0) {
        this.goodsList = data["data"];
      }
    });

    this.updateList();
  }

  updateList(reset: boolean = false): void {
    if (reset) {
      this.page.index = 1;
    }

    this.reqObj.page = this.page.index - 1;
    this.reqObj.size = this.page.size;
    this.reqObj.accountId = this.userInfo.id;
    sessionStorage.setItem(this.router.url + "2", JSON.stringify(this.reqObj));

    this.isTableLoading = true;
    this.httpReq.post(
      "outWarehouse/listGoodsWhere",
      null,
      this.reqObj,
      data => {
        this.isTableLoading = false;
        if (data["status"] == 200 && data["code"] == 0) {
          const result = JSON.parse(data["data"]);
          this.list = result.desc;
          this.page.total = result.totalElements;
        }
      }
    );
  }

  onRangerPickerChange(dateArr: Date[]) {
    if (dateArr[0]) {
      this.reqObj.btime = this.jsUtil.dateFormat(dateArr[0]) + " 00:00:00";
    } else {
      this.reqObj.btime = "";
    }
    if (dateArr[1]) {
      this.reqObj.etime = this.jsUtil.dateFormat(dateArr[1]) + " 23:59:59";
    } else {
      this.reqObj.btime = "";
    }
  }
}
