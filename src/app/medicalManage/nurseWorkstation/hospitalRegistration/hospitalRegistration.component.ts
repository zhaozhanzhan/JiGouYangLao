import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";
import { GlobalService } from "../../../common/service/GlobalService";
import { LocalStorage } from "../../../common/service/local.storage";
import { NzMessageService, NzModalService } from "ng-zorro-antd";
@Component({
  selector: "app-hospitalRegistration",
  templateUrl: "./hospitalRegistration.component.html",
  styleUrls: ["./hospitalRegistration.component.css"]
})
export class HospitalRegistrationComponent implements OnInit {
  list = [];

  page = {
    total: 0,
    size: 10,
    index: 1
  };

  reqObj = {
    page: 1,
    size: 10,
    name: "" //名字
  };

  isTableLoading = false;
  user;
  accountId;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpReq: HttpReqService,
    private jsUtil: JsUtilsService,
    private globalService: GlobalService,
    private message: NzMessageService,
    private localStorage: LocalStorage, //存储
    private modalService: NzModalService //提示
  ) {}

  ngOnInit() {
    this.user = this.localStorage.getUser();
    this.accountId = this.user.data.id;

    if (sessionStorage.getItem(this.router.url) !== null) {
      this.reqObj = JSON.parse(sessionStorage.getItem(this.router.url));
    }
    this.updateList();
  }

  // 添加跳转
  turnToAdd() {
    this.router.navigate(["addEdit"], {
      relativeTo: this.route
    });
  }
  // 修改跳转
  turnToEdit(data) {
    this.router.navigate(["addEdit", { data: JSON.stringify(data) }], {
      relativeTo: this.route
    });
  }

  // 查看跳转
  turnTocheck(data) {
    this.router.navigate(["check", { data: JSON.stringify(data) }], {
      relativeTo: this.route
    });
  }

  // 入院信息列表
  turnTocheckInInfor(data) {
    this.router.navigate(["../checkInInfor", { data: JSON.stringify(data) }], {
      relativeTo: this.route
    });
  }

  // 获得列表
  updateList(reset: boolean = false): void {
    if (reset) {
      this.page.index = 1;
    }
    this.reqObj.page = this.page.index - 1;
    this.reqObj.size = this.page.size;

    sessionStorage.setItem(this.router.url, JSON.stringify(this.reqObj));

    this.isTableLoading = true;
    this.httpReq.post("/basic_info/listPage", null, this.reqObj, data => {
      this.isTableLoading = false;
      if (data["code"] == 0) {
        this.list = data["data"]["content"];
        this.page.total = data["data"]["totalElements"];
      }
    });
  }

  // 删除
  delete(id) {
    this.globalService.delModal(() => {
      this.httpReq.post(
        "/basic_info/delete",
        null,
        { id: id, accountId: this.accountId },
        data => {
          if (data["code"] == 0) {
            this.message.success("删除成功！");
            this.updateList();
          }
        }
      );
    });
  }
}
