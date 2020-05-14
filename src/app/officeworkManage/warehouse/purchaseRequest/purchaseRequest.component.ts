import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";
import { Utils } from "../../../common/utils/utils";
import { GlobalService } from "../../../common/service/GlobalService";
import { NzMessageService, NzTreeNode, NzFormatEmitEvent } from 'ng-zorro-antd';
@Component({
  selector: "app-purchaseRequest",
  templateUrl: "./purchaseRequest.component.html",
  styleUrls: ["./purchaseRequest.component.css"]
})
export class PurchaseRequestComponent implements OnInit {
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

 goodsClassificationNodes;
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

  turnToAdd() {
    this.router.navigate(["addEdit", { state: "add" }], {
      relativeTo: this.route
    });
  }
  turnToEdit(id) {
    this.router.navigate(["addEdit", { requestId: id, state: "edit" }], {
      relativeTo: this.route
    });
  }
  turnToInfo(id) {
    this.router.navigate(["addEdit", { requestId: id, state: "info" }], {
      relativeTo: this.route
    });
  }
  turnToInStorehouse(id) {
    this.router.navigate(["inStorehouse", { requestId: id }], {
      relativeTo: this.route
    });
  }
  turnToShowForAfterIn(id) {
    this.router.navigate(["showForAfterIn", { requestId: id, state: "info" }], {
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
  delete(id) {
    this.globalService.delModal(() => {
      this.httpReq.post("requisition/delete", null, { id: id }, data => {
        if (data["code"] == 0) {
          this.message.success("删除成功！");
          this.updateList();
        }
      });
    });
  }
}
