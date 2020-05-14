import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";
import { GlobalService } from "../../../common/service/GlobalService";
import { LocalStorage } from "../../../common/service/local.storage";
import { NzMessageService, NzModalService } from "ng-zorro-antd";
@Component({
  selector: "app-pharmaceuticalAdministration",
  templateUrl: "./pharmaceuticalAdministration.component.html",
  styleUrls: ["./pharmaceuticalAdministration.component.css"]
})
export class PharmaceuticalAdministrationComponent implements OnInit {
  list = [];

  page = {
    total: 0,
    size: 10,
    index: 1
  };

  reqObj = {
    page: 1,
    size: 10,
    search: "", //药品名称或者拼音首字母
    limitLevel: "", //"限制等级
    drugStatus: "", //药品状态
    drugType: "" //药品类别
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
  // 库存明细跳转
  turnToStock(data) {
    this.router.navigate(["stock", { data: JSON.stringify(data) }], {
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
    this.httpReq.post("/med_drug/listPage", null, this.reqObj, data => {
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
        "/med_drug/delete",
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

  // 禁用
  forbidden(id, drugStatus) {
    let that = this;
    let drugStatusName;
    if (drugStatus == "0") {
      drugStatusName = "启用";
    } else {
      drugStatusName = "禁用";
    }

    this.modalService.confirm({
      nzTitle: "请确认是否" + drugStatusName + "?",
      nzOkText: "确认",
      nzOkType: "danger",
      nzOnOk: () => {
        that.httpReq.post(
          "/med_drug/enableDisable",
          null,
          { id: id, accountId: that.accountId },
          data => {
            if (data["code"] == 0) {
              if (drugStatus == "0") {
                that.message.success("启用成功！");
              } else {
                that.message.success("禁用成功！");
              }

              that.updateList();
            }
          }
        );
      },
      nzCancelText: "取消",
      nzOnCancel: () => {}
    });
  }
}
