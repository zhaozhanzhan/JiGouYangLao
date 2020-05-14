import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { Utils } from "../../../common/utils/utils";
@Component({
  selector: "app-info-interview",
  templateUrl: "./service-change.component.html",
  styleUrls: ["./service-change.component.css"]
})
export class ServiceChangeComponent implements OnInit {
  list;
  page = {
    total: 0,
    size: 10,
    index: 1
  };
  name;
  params = {
    name: "",
    page: this.page.index - 1,
    size: this.page.size,
    btime: "",
    etime: ""
  };
  selectedDate = [];
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private jsUtil: JsUtilsService,
    private httpReq: HttpReqService
  ) {}

  ngOnInit() {
    if (sessionStorage.getItem(this.router.url) !== null) {
      this.params = JSON.parse(sessionStorage.getItem(this.router.url));
      if (
        !Utils.isEmpty(this.params.btime) &&
        !Utils.isEmpty(this.params.etime)
      ) {
        this.selectedDate.push(new Date(this.params.btime));
        this.selectedDate.push(new Date(this.params.etime));
      }
    }
    this.updateList();
  }

  turnToCheck(id, e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    this.router.navigate(["check", id], { relativeTo: this.route });
  }

  isTableLoading = false;

  updateList(reset: boolean = false): void {
    this.isTableLoading = true;
    if (reset) {
      this.params.page = 1;
    }
    //接口page从0下标位开始
    this.params.page = this.params.page - 1;
    if (this.params.page < 0) {
      this.params.page = 0;
    }

    const that = this;
    this.httpReq.post("/oldmanUnusualChange/list", null, that.params, data => {
      sessionStorage.setItem(that.router.url, JSON.stringify(that.params));
      that.isTableLoading = false;
      if (data["status"] == 200) {
        that.params.page++;
        that.page.total = data["data"]["totalElements"];
        that.list = data["data"]["content"];
      }
    });
  }

  /**
   * 时间范围筛选
   */
  onRangerPickerChange(dateArr: Date[]) {
    if (dateArr.length == 2) {
      this.params.btime = this.jsUtil.dateFormat(dateArr[0]) + " 00:00:00";
      this.params.etime = this.jsUtil.dateFormat(dateArr[1]) + " 23:59:59";
    } else {
      this.params.btime = "";
      this.params.etime = "";
    }
  }
}
