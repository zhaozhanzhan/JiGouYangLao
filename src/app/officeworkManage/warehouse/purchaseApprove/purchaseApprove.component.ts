import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";
import { Utils } from "../../../common/utils/utils";
import { NzMessageService } from "ng-zorro-antd";
import { GlobalService } from "../../../common/service/GlobalService";

@Component({
  selector: "app-purchaseApprove",
  templateUrl: "./purchaseApprove.component.html",
  styleUrls: ["./purchaseApprove.component.css"]
})
export class PurchaseApproveComponent implements OnInit {
  departmentList = [];
  list = [];

  page = {
    total: 0,
    size: 10,
    index: 1
  };

  reqObj = {
    page: 1,
    size: 10,
    departmentId: "",
    rOperator: "",
    btime: "",
    etime: "",
    status: "",
    inWhStatus: ""
  };

  selectedDates = [];
  isTableLoading = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpReq: HttpReqService,
    private jsUtil: JsUtilsService,
    private globalService: GlobalService,
    private message: NzMessageService
  ) {}

  ngOnInit() {
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

    this.httpReq.post("department/listAll", null, {}, data => {
      if (data["status"] == 200) {
        this.departmentList = data["data"];
      }
    });

    this.updateList();
  }

  turnToApprove(id) {
    this.router.navigate(["approve", { requestId: id, state: "edit" }], {
      relativeTo: this.route
    });
  }
  turnToInfo(id) {
    this.router.navigate(["approve", { requestId: id, state: "info" }], {
      relativeTo: this.route
    });
  }
  updateList(reset: boolean = false): void {
    if (reset) {
      this.page.index = 1;
    }
    this.reqObj.page = this.page.index - 1;
    this.reqObj.size = this.page.size;

    sessionStorage.setItem(this.router.url + "1", JSON.stringify(this.reqObj));

    this.isTableLoading = true;
    this.httpReq.post("requisition/listCondition", null, this.reqObj, data => {
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
