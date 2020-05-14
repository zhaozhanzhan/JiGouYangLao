import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { NzModalService } from "ng-zorro-antd";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";
import { Utils } from "../../../common/utils/utils";
@Component({
  selector: "app-admission-review",
  templateUrl: "./admission-review-manager.component.html",
  styleUrls: ["./admission-review-manager.component.css"]
})
export class AdmissionReviewManagerComponent implements OnInit {
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
    appayType: "0",
    date: []
  };

  isVisible = false;
  isTableLoading = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NzModalService,
    private jsUtil: JsUtilsService,
    private httpReq: HttpReqService // Http请求服务
  ) {}

  ngOnInit() {
    if (sessionStorage.getItem(this.router.url) !== null) {
      this.reqObj = JSON.parse(sessionStorage.getItem(this.router.url));
      if (
        !Utils.isEmpty(this.reqObj.btime) &&
        !Utils.isEmpty(this.reqObj.etime)
      ) {
        this.reqObj.date.push(new Date(this.reqObj.btime));
        this.reqObj.date.push(new Date(this.reqObj.etime));
      }
    }
    this.updateList();
  }

  turnToReview(id, appayType, e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    this.router.navigate(["review", { id: id, appayType: appayType }], {
      relativeTo: this.route
    });
  }

  turnToAudit(id, e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    this.router.navigate(["audit", id], { relativeTo: this.route });
  }

  turnToCheck(id, e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    this.router.navigate(["check", id], { relativeTo: this.route });
  }

  onRangerPickerChange(dateArr: Date[]) {
    this.reqObj.btime = this.jsUtil.dateFormat(dateArr[0]) + " 00:00:00";
    this.reqObj.etime = this.jsUtil.dateFormat(dateArr[1]) + " 23:59:59";
  }

  updateList(reset: boolean = false): void {
    this.isTableLoading = true;
    if (reset) {
      this.page.index = 1;
    }

    this.reqObj.page = this.page.index - 1;
    this.reqObj.size = this.page.size;

    const that = this;
    this.isTableLoading = true;
    this.httpReq.post("oldman/asslist", null, this.reqObj, data => {
      this.reqObj.page++;
      sessionStorage.setItem(this.router.url, JSON.stringify(this.reqObj));
      that.isTableLoading = false;
      if (data["status"] == 200) {
        that.page.total = data["data"]["totalElements"];
        that.list = data["data"]["content"];
      }
    });
  }

  /**
   * 日期插件时间发生变化的回调
   * @param dateArr
   */
  public selDate(dateArr: Array<Date>) {
    if (dateArr[0]) {
      this.reqObj.btime = this.jsUtil.dateFormat(dateArr[0]) + " 00:00:00";
    } else {
      this.reqObj.btime = "";
    }
    if (dateArr[1]) {
      this.reqObj.etime = this.jsUtil.dateFormat(dateArr[1]) + " 23:59:59";
    } else {
      this.reqObj.etime = "";
    }
  }
}
