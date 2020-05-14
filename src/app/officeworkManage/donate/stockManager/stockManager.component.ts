import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Utils } from "../../../common/utils/utils";
import { LocalStorage } from "../../../common/service/local.storage";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";
@Component({
  selector: "app-stockManager",
  templateUrl: "./stockManager.component.html",
  styleUrls: ["./stockManager.component.css"]
})
export class StockManagerComponent implements OnInit {
  goodsList = [];
  list = [];
  ChooseDate = "全部";
  page = {
    total: 0,
    size: 10,
    index: 1
  };

  queryParams = {
    page: 0,
    size: 10,
    goodsId: "",
    whId: "",
    btime: "",
    etime: "",
    expireBdate: "",
    expireEdate: "",
    accountId: ""
  };
  selectedDates = [];
  storehouseList = [];
  isTableLoading = false;
  userInfo;
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

    if (sessionStorage.getItem(this.router.url + "2") !== null) {
      this.ChooseDate = JSON.parse(
        sessionStorage.getItem(this.router.url + "2")
      );
      this.choose();
    }
    if (sessionStorage.getItem(this.router.url + "1") !== null) {
      this.queryParams = JSON.parse(
        sessionStorage.getItem(this.router.url + "1")
      );
      if (
        !Utils.isEmpty(this.queryParams.btime) &&
        !Utils.isEmpty(this.queryParams.etime)
      ) {
        this.selectedDates.push(new Date(this.queryParams.btime));
        this.selectedDates.push(new Date(this.queryParams.etime));
      }
    }

    this.httpReq.post(
      "donatedWarehouse/listAllByAccount",
      null,
      { accountId: this.userInfo.id },
      data => {
        if (data["status"] == 200 && data["code"] == 0) {
          this.storehouseList = data["data"];
        }
      }
    );
    this.httpReq.post("donatedGoods/listAll", null, {}, data => {
      if (data["status"] == 200 && data["code"] == 0) {
        this.goodsList = data["data"];
      }
    });

    this.updateList();
  }
  choose() {
    if (this.ChooseDate == "即将到期") {
      let date = new Date();
      let year = date.getFullYear();
      let mouth = date.getMonth() + 1;
      let day = date.getDate();
      this.queryParams.expireBdate = year + "-" + mouth + "-" + day;
      this.queryParams.expireEdate = this.fun_date(14);
    } else if (this.ChooseDate == "已经到期") {
      let date = new Date();
      let year = date.getFullYear();
      let mouth = date.getMonth() + 1;
      let day = date.getDate() - 1;
      this.queryParams.expireBdate = "2018-01-01";
      this.queryParams.expireEdate = year + "-" + mouth + "-" + day;
      console.log(
        "this.queryParams.expireEdate" + this.queryParams.expireEdate
      );
      console.log(
        "this.queryParams.expireEdate" + year + "-" + mouth + "-" + day
      );
    } else {
      this.queryParams.expireBdate = "";
      this.queryParams.expireEdate = "";
    }
  }

  fun_date(aa) {
    const date1 = new Date();
    const day = date1.getDate();
    const time1 =
      date1.getFullYear() + "-" + (date1.getMonth() + 1) + "-" + day; //time1表示当前时间

    const date2 = new Date(date1);

    date2.setDate(date1.getDate() + aa);
    const day2 = date2.getDate();
    const time2 =
      date2.getFullYear() + "-" + (date2.getMonth() + 1) + "-" + day2;
    return time2;
  }
  turnToCheck(inStorehouse) {
    this.router.navigate(
      ["check", { inRecordId: inStorehouse.id, state: "check" }],
      { relativeTo: this.route }
    );
  }
  red = false;
  hu = false;
  updateList(reset: boolean = false): void {
    if (reset) {
      this.page.index = 1;
    }
    this.queryParams.page = this.page.index - 1;
    this.queryParams.size = this.page.size;
    this.queryParams.accountId = this.userInfo.id;
    sessionStorage.setItem(
      this.router.url + "1",
      JSON.stringify(this.queryParams)
    );

    sessionStorage.setItem(
      this.router.url + "2",
      JSON.stringify(this.ChooseDate)
    );
    let that = this;
    this.isTableLoading = true;
    this.httpReq.post(
      "donatedInventory/listCondition",
      null,
      this.queryParams,
      data => {
        that.isTableLoading = false;
        if (data["code"] == 0) {
          let resultData = JSON.parse(data["data"]);
          that.list = resultData["info"];
          that.page.total = resultData["totalElements"];
        }
      }
    );
  }

  /**
   * 时间范围筛选
   */
  onRangerPickerChange(dateArr: Date[]) {
    if (dateArr.length == 2) {
      this.queryParams.btime = this.jsUtil.dateFormat(dateArr[0]) + " 00:00:00";
      this.queryParams.etime = this.jsUtil.dateFormat(dateArr[1]) + " 23:59:59";
    } else {
      this.queryParams.btime = "";
      this.queryParams.etime = "";
    }
  }
}
