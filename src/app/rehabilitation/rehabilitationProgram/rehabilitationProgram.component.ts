import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { NzMessageService } from "ng-zorro-antd";
import { HttpReqService } from "../../common/service/HttpUtils.Service";
import { GlobalService } from "../../common/service/GlobalService";
import { Utils } from "../../common/utils/utils";
import { JsUtilsService } from "../../common/service/JsUtils.Service";
@Component({
  selector: "app-rehabilitationProgram",
  templateUrl: "./rehabilitationProgram.component.html",
  styleUrls: ["./rehabilitationProgram.component.css"]
})
export class RehabilitationProgramComponent implements OnInit {
  page = {
    total: 0,
    size: 10,
    index: 1
  };

  reqObj = {
    page: 1,
    size: 10,
    name: "",
    type: "" //康复类型
  }; //请求列表得参数
  list = []; //列表得数组
  isTableLoading = false; //列表加载状态

  constructor(
    private httpReq: HttpReqService,
    private globalService: GlobalService,
    private message: NzMessageService,
    private router: Router,
    private route: ActivatedRoute,
    private jsUtil: JsUtilsService
  ) {}

  ngOnInit() {
    if (sessionStorage.getItem(this.router.url) !== null) {
      this.reqObj = JSON.parse(sessionStorage.getItem(this.router.url));
    }

    this.updateList();
  }

  // 获得所有列表的信息
  updateList(reset: boolean = false): void {
    if (reset) {
      this.page.index = 1;
    }

    if (this.reqObj.type == null) {
      this.reqObj.type = "";
    }

    this.reqObj.page = this.page.index - 1;
    this.reqObj.size = this.page.size;
    sessionStorage.setItem(this.router.url, JSON.stringify(this.reqObj));
    this.isTableLoading = true;
    this.httpReq.get("/rehabilitationPlan/list", this.reqObj, data => {
      this.isTableLoading = false;
      if (data["status"] == 200) {
        this.list = data["data"]["content"];
        this.page.total = data["data"]["totalElements"];
      }
    });
  }

  // 跳转到季度计划
  toSeasonalPlan(data, e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    this.router.navigate(
      [
        "seasonalPlanDetails",
        { id: data.id, childrenId: data.childrenId, data: JSON.stringify(data) }
      ],
      {
        relativeTo: this.route
      }
    );
  }
  // 跳转到月度计划
  toMonthPlan(data, e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    this.router.navigate(
      [
        "monthPlanDetails",
        { id: data.id, childrenId: data.childrenId, data: JSON.stringify(data) }
      ],
      {
        relativeTo: this.route
      }
    );
  }

  // 跳转到周计划
  toWeekPlan(data, e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    this.router.navigate(
      [
        "weekPlanDetails",
        { id: data.id, childrenId: data.childrenId, data: JSON.stringify(data) }
      ],
      {
        relativeTo: this.route
      }
    );
  }
}
