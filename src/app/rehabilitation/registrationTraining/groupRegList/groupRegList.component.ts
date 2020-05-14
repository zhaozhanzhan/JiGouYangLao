import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";
import { Utils } from "../../../common/utils/utils";
import { LocalStorage } from "../../../common/service/local.storage";
import { NzMessageService } from "ng-zorro-antd";
import { GlobalService } from "../../../common/service/GlobalService";
@Component({
  selector: "app-groupRegList",
  templateUrl: "./groupRegList.component.html",
  styleUrls: ["./groupRegList.component.css"]
})
export class GroupRegListComponent implements OnInit {
  list = [];

  page = {
    total: 0,
    size: 10,
    index: 1
  };

  reqObj = {
    page: 1,
    size: 10,
    childrenId: "", //儿童得ID
    type: "2", //类型：1是个人，2是团体
    teamId: "" //小组得ID
  };
  isTableLoading = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpReq: HttpReqService,
    private jsUtil: JsUtilsService,
    private globalService: GlobalService,
    private message: NzMessageService,
    private localStorage: LocalStorage
  ) {}

  ngOnInit() {
    this.reqObj.teamId = this.route.snapshot.paramMap.get("id");
    this.updateList();
  }

  updateList(reset: boolean = false): void {
    if (reset) {
      this.page.index = 1;
    }
    this.reqObj.page = this.page.index - 1;
    this.reqObj.size = this.page.size;
    this.isTableLoading = true;
    this.httpReq.get("/training/recordList", this.reqObj, data => {
      this.isTableLoading = false;
      if (data["code"] == 0) {
        this.list = data["data"]["content"];
        this.page.total = data["data"]["totalElements"];
      }
    });
  }

  // 跳转到添加页面
  turnToAdd(data) {
    if (data == "") {
      this.router.navigate(["../groupReDetails", { id: this.reqObj.teamId }], {
        relativeTo: this.route
      });
    } else {
      this.router.navigate(
        ["../groupReDetails", { id: this.reqObj.teamId, recordId: data.id }],
        {
          relativeTo: this.route
        }
      );
    }
  }
  // 删除
  delete(id, e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    this.globalService.delModal(() => {
      this.httpReq.get("/training/del", { id: id, type: "2" }, data => {
        if (data["code"] == 0) {
          this.message.success("删除成功！");
          this.updateList();
        } else {
          this.message.error(data.message);
        }
      });
    });
  }
  // 返回
  back() {
    history.back();
  }
}
