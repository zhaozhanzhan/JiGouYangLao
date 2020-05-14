import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { LocalStorage } from "../../../../common/service/local.storage";
import { Utils } from "../../../../common/utils/utils";
import { HttpReqService } from "../../../../common/service/HttpUtils.Service";
import { JsUtilsService } from "../../../../common/service/JsUtils.Service";

@Component({
  selector: "app-checkOutList1",
  templateUrl: "./checkOutList1.component.html",
  styleUrls: ["./checkOutList1.component.css"]
})
export class CheckOutList1Component implements OnInit {
  page = {
    total: 0,
    size: 10,
    index: 1
  };

  reqObj = {
    goodsInfo: "",
    spid: "",
    page: 1,
    size: 10,
    btime: "",
    etime: "",
    status: "1",
    goodsKind: "0"
  };
  storehouseClassificationList = [];
  goodsList = [];
  selectedDates = [];
  list = [];
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpReq: HttpReqService,
    private jsUtil: JsUtilsService,
    private localStroage: LocalStorage
  ) {}

  ngOnInit() {
    if (sessionStorage.getItem(this.router.url + "1") !== null) {
      this.reqObj = JSON.parse(sessionStorage.getItem(this.router.url + "1"));
      this.page.index = this.reqObj.page + 1;
      this.page.size = this.reqObj.size;
      if (
        !Utils.isEmpty(this.reqObj.btime) &&
        !Utils.isEmpty(this.reqObj.etime)
      ) {
        this.selectedDates.push(new Date(this.reqObj.btime));
        this.selectedDates.push(new Date(this.reqObj.etime));
      }
    }

    this.httpReq.post("/schedulingProgram/list1", null, {}, data => {
      if (data["status"] == 200) {
        this.storehouseClassificationList = data["data"];
      }
    });

    this.httpReq.post("goods/listAll", null, {}, data => {
      if (data["status"] == 200 && data["code"] == 0) {
        this.goodsList = data["data"];
      }
    });

    this.updateList();
  }

  turnToEdit(id) {
    this.router.navigate(["checkOut", { id: id }], { relativeTo: this.route });
  }

  updateList(reset: boolean = false): void {
    if (reset) {
      this.page.index = 1;
    }
    this.reqObj.page = this.page.index - 1;
    this.reqObj.size = this.page.size;

    sessionStorage.setItem(this.router.url + "1", JSON.stringify(this.reqObj));

    this.httpReq.post("/outSend/sendListPc", null, this.reqObj, data => {
      if (data["status"] == 200 && data["code"] == 0) {
        const result = JSON.parse(data["data"]);
        this.list = result.goodInfo;
        this.page.total = result.totalElements;
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
