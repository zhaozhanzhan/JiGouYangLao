import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpReqService } from "../../../../common/service/HttpUtils.Service";
import { JsUtilsService } from "../../../../common/service/JsUtils.Service";
import { LocalStorage } from "../../../../common/service/local.storage";
import { Utils } from "../../../../common/utils/utils";

@Component({
  selector: "app-out-storehouse-list1",
  templateUrl: "./out-storehouse-list1.component.html",
  styleUrls: ["./out-storehouse-list1.component.css"]
})
export class OutStorehouseList1Component implements OnInit {
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
  user;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpReq: HttpReqService,
    private jsUtil: JsUtilsService,
    private localStroage: LocalStorage
  ) {}

  ngOnInit() {
    let userInfoData: any = this.localStroage.getUser();
    this.userInfo = userInfoData.data;
    this.reqObj.accountId = this.userInfo.id;
    if (sessionStorage.getItem(this.router.url + "1") !== null) {
      this.reqObj = JSON.parse(sessionStorage.getItem(this.router.url + "1"));
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

  turnToCheck(outStorehouse) {
    this.router.navigate(
      [
        "check",
        { outStorehouse: JSON.stringify(outStorehouse), state: "check" }
      ],
      { relativeTo: this.route }
    );
  }

  updateList(reset: boolean = false): void {
    if (reset) {
      this.page.index = 1;
    }

    this.reqObj.page = this.page.index - 1;
    this.reqObj.size = this.page.size;
    this.reqObj.accountId = this.userInfo.id;

    sessionStorage.setItem(this.router.url + "1", JSON.stringify(this.reqObj));

    this.isTableLoading = true;
    this.httpReq.post("outWarehouse/listWhere", null, this.reqObj, data => {
      this.isTableLoading = false;
      if (data["status"] == 200) {
        this.list = data["data"]["content"];
        this.page.total = data["data"]["totalElements"];
      }
    });
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
