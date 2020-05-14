import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpReqService } from "../../common/service/HttpUtils.Service";
import { GlobalService } from "../../common/service/GlobalService";
import { NzMessageService } from "ng-zorro-antd";

@Component({
  selector: "app-rehabilitation-user",
  templateUrl: "user.component.html"
})
export class UserComponent implements OnInit {
  list;
  page = {
    total: 0,
    size: 10,
    index: 1
  };

  reqObj = {
    search:'',
    page: 1,
    size: 10
  };

  isTableLoading = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpReq: HttpReqService,
    private globalService: GlobalService,
    private message: NzMessageService
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
    this.httpReq.post("account/listCondition", null,this.reqObj, data => {
      this.isTableLoading = false;
      if (data["status"] == 200) {
        this.list = data["data"]["content"]; // 数据列表
        this.page.total = data["data"]["totalElements"]; // 总条数
      }
    });
  }

  turnToAddUser() {
    this.router.navigate(["add"], { relativeTo: this.route });
  }

  turnToEditInfo(user) {
    this.router.navigate(["edit", JSON.stringify(user)], {
      relativeTo: this.route
    });
  }

  turnToEditPassword(user) {
    this.router.navigate(["editPassword", JSON.stringify(user)], {
      relativeTo: this.route
    });
  }

  deleteUser(id) {
    this.globalService.delModal(() => {
      this.httpReq.get("account/del", { id: id }, data => {
        if (data["status"] == 200) {
          this.message.success("删除成功！");
          this.updateList();
        }
      });
    });
  }

  startoffUser(id) {
    this.httpReq.post("account/startoff", null, { id: id }, data => {
      if (data["status"] == 200) {
        this.message.success("保存成功！");
        this.updateList();
      }
    });
  }
}
