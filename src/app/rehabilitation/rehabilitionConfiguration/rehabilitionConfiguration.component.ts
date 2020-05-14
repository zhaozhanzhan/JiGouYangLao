import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { NzMessageService } from "ng-zorro-antd";
import { HttpReqService } from "../../common/service/HttpUtils.Service";
import { GlobalService } from "../../common/service/GlobalService";
@Component({
  selector: "app-rehabilitionConfiguration",
  templateUrl: "./rehabilitionConfiguration.component.html",
  styleUrls: ["./rehabilitionConfiguration.component.css"]
})
export class RehabilitionConfigurationComponent implements OnInit {
  page = {
    total: 0,
    size: 10,
    index: 1
  };

  reqObj = {
    page: 1,
    size: 10,
    name: "", //名称
    type: "" //类型
  };
  list = [];
  isTableLoading = false;

  constructor(
    private httpReq: HttpReqService,
    private globalService: GlobalService,
    private message: NzMessageService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    if (sessionStorage.getItem(this.router.url) !== null) {
      this.reqObj = JSON.parse(sessionStorage.getItem(this.router.url));
      this.page.index = this.reqObj.page + 1;
      this.page.size = this.reqObj.size;
    }

    this.updateList();
  }

  // 获得所有列表的信息
  updateList(reset: boolean = false): void {
    if (reset) {
      this.page.index = 1;
    }
    this.reqObj.page = this.page.index - 1;
    this.reqObj.size = this.page.size;
    sessionStorage.setItem(this.router.url, JSON.stringify(this.reqObj));
    this.isTableLoading = true;
    this.httpReq.get("/rehabilitionConfig/list", this.reqObj, data => {
      this.isTableLoading = false;
      if (data["code"] == 0) {
        this.list = data["data"]["content"];
        this.page.total = data["data"]["totalElements"];
      }
    });
  }

  // 跳转到康复配置数据列表
  turnToEdit(id, name, data, e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    this.router.navigate(
      ["dictionaryData", { id: id, name: name, data: JSON.stringify(data) }],
      {
        relativeTo: this.route
      }
    );
  }
}
