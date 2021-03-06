import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";

@Component({
  selector: "app-jordanclean",
  templateUrl: "jordanclean.component.html"
})
export class JordanCleanComponent implements OnInit {
  list;
  page = {
    total: 0,
    size: 10,
    index: 1
  };

  reqObj = {
    page: 1,
    size: 10,
    employees: "",
    btime: "",
    etime: ""
  };

  loading = true;

  constructor(
    private httpReq: HttpReqService,
    private router: Router,
    private route: ActivatedRoute,
    private jsUtil: JsUtilsService
  ) {}

  ngOnInit() {
    this.updateList();

    if (sessionStorage.getItem(this.router.url) !== null) {
      this.reqObj = JSON.parse(sessionStorage.getItem(this.router.url));
    }
  }

  turnToCheck(resMemo, e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    this.router.navigate(["check", JSON.stringify(resMemo)], {
      relativeTo: this.route
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

  updateList(reset: boolean = false): void {
    if (reset) {
      this.page.index = 1;
    }

    this.reqObj.page = this.page.index - 1;
    this.reqObj.size = this.page.size;

    sessionStorage.setItem(this.router.url, JSON.stringify(this.reqObj));

    this.loading = true;
    this.httpReq.post("jordanClean/list1", null, this.reqObj, data => {
   
      this.loading = false;
      if (data["status"] == 200) {
        this.list = data["data"]["content"]; // 数据列表
        this.page.total = data["data"]["totalElements"]; // 总条数
      }
    });
  }

  searchList() {
    this.updateList();
  }
}
