import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { NzModalService } from "ng-zorro-antd";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { Utils } from "../../../common/utils/utils";
@Component({
  selector: "app-discharged-registration",
  templateUrl: "./discharged-registration-manager.component.html",
  styleUrls: ["./discharged-registration-manager.component.css"]
})
export class DischargedRegistrationManagerComponent implements OnInit {
  list;
  page = {
    total: 0,
    size: 10,
    index: 1
  };

  reqObj = {
    page: 1,
    size: 10,
    name: "",
    cardno: "",
    btime: "",
    etime: "",
    isApply: "1"
  };
  isTableLoading = false;
  isVisible = false;
  selectedDate = [];
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NzModalService,
    private jsUtil: JsUtilsService,
    private httpReq: HttpReqService
  ) {}

  ngOnInit() {
    if (sessionStorage.getItem(this.router.url) !== null) {
      this.reqObj = JSON.parse(sessionStorage.getItem(this.router.url));
      if (
        !Utils.isEmpty(this.reqObj.btime) &&
        !Utils.isEmpty(this.reqObj.etime)
      ) {
        this.selectedDate.push(new Date(this.reqObj.btime));
        this.selectedDate.push(new Date(this.reqObj.etime));
      }
    }
    this.updateList();
  }

  turnToAdd(e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    this.router.navigate(["save"], { relativeTo: this.route });
  }

  turnToEdit(id, e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    this.router.navigate(["save", { id: id }], { relativeTo: this.route });
  }

  turnToCheck(id, e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    this.router.navigate(["check", id], { relativeTo: this.route });
  }

  turnToLook(id, e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    this.router.navigate(["look", id], { relativeTo: this.route });
  }
  showDeleteConfirm(id, e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }

    this.del(() => {
      const that = this;
      this.httpReq.post("dischargeRegistration/del", null, { id: id }, data => {
        if (data["status"] == 200) {
          that.page.total = data["data"].totalElements;
          that.list = data["data"]["content"];
        }
      });
    });
  }

  del(fun: Function) {
    this.modalService.confirm({
      nzTitle: "请确认是否删除？",
      // nzContent: '<b style="color: red;">Some descriptions</b>',
      nzOkText: "确认",
      nzOkType: "danger",
      nzOnOk: () => fun(),
      nzCancelText: "取消",
      nzOnCancel: () => console.log("Cancel")
    });
  }

  /**
   * 时间范围筛选
   */
  onRangerPickerChange(dateArr: Date[]) {
    if (dateArr.length == 2) {
      this.reqObj.btime = this.jsUtil.dateFormat(dateArr[0]) + " 00:00:00";
      this.reqObj.etime = this.jsUtil.dateFormat(dateArr[1]) + " 23:59:59";
    } else {
      this.reqObj.btime = "";
      this.reqObj.etime = "";
    }
  }

  updateList(reset: boolean = false): void {
    this.isTableLoading = true;
    if (reset) {
      this.page.index = 1;
    }

    this.reqObj.page = this.page.index - 1;
    this.reqObj.size = this.page.size;

    const that = this;
    let param = this.httpReq.post(
      "/dischargeRegistration/list",
      null,
      this.reqObj,
      data => {
        this.isTableLoading = false;
        sessionStorage.setItem(that.router.url, JSON.stringify(this.reqObj));
        if (data["status"] == 200) {
          that.page.total = data["data"]["totalElements"];
          that.list = data["data"]["content"];
          console.log(that.list);
        }
      }
    );
  }
}
