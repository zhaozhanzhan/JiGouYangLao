import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";
import { Utils } from "../../../common/utils/utils";
import { LocalStorage } from "../../../common/service/local.storage";
@Component({
  selector: "app-groupReg",
  templateUrl: "./groupReg.component.html",
  styleUrls: ["./groupReg.component.css"]
})
export class GroupRegComponent implements OnInit {
  page = {
    total: 0,
    size: 10,
    index: 1
  };

  reqObj = {
    page: 1,
    size: 10
  }; //请求列表得参数
  list = []; //列表得数组
  isTableLoading = false; //列表加载状态

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpReq: HttpReqService,
    private jsUtil: JsUtilsService,
    private localStorage: LocalStorage
  ) {}

  ngOnInit() {
    this.updateList();
  }

  updateList(reset: boolean = false): void {
    if (reset) {
      this.page.index = 1;
    }
    this.reqObj.page = this.page.index - 1;
    this.reqObj.size = this.page.size;

    this.isTableLoading = true;
    this.httpReq.get("/rehabilitionTeam/list", this.reqObj, data => {
      this.isTableLoading = false;
      if (data["code"] == 0) {
        this.list = data["data"]["content"];
        this.page.total = data["data"]["totalElements"];
      }
    });
  }

  checkIn(data) {
    this.router.navigate(
      ["groupRegList", { id: data.id, childIds: data.childrenIds }],
      {
        relativeTo: this.route
      }
    );
  }
}
