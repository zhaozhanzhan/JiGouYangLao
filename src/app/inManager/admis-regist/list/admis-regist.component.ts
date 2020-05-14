import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { NzModalService, NzMessageService } from "ng-zorro-antd";
import { JsUtilsService } from "../../../common/service/JsUtils.Service";
import { HttpReqService } from "../../../common/service/HttpUtils.Service";
import { GlobalService } from "../../../common/service/GlobalService";
import { Utils } from "../../../common/utils/utils";

@Component({
  selector: "app-admis-regist",
  templateUrl: "./admis-regist.component.html",
  styleUrls: ["./admis-regist.component.css"]
})
export class AdmisRegistComponent implements OnInit {
  isTableLoading = false;
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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NzModalService,
    private jsUtil: JsUtilsService,
    private httpReq: HttpReqService,
    private globalService: GlobalService,
    private message: NzMessageService
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
  gradeChange() {}
  turnToAdd(e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    this.router.navigate(["save"], { relativeTo: this.route });
  }

  turnToEdit(id, e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    this.router.navigate(["save", { id: id }], { relativeTo: this.route });
  }

  turnToCheck(id, e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    this.router.navigate(["check", id], { relativeTo: this.route });
  }

  showDeleteConfirm(id, e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    this.globalService.delModal(() => {
      this.deleteData(id);
    });
  }

  del(fun: Function) {
    this.modalService.confirm({
      nzTitle: "请确认是否删除？",
      // nzContent: '<b style="color: red;">Some descriptions</b>',
      nzOkText: "确认",
      nzOkType: "danger",
      nzOnOk: () => fun(),
      nzCancelText: "取消",
      nzOnCancel: () => console.log("Cancel")
    });
  }

  updateList(reset: boolean = false): void {
    let that = this;
    if (reset) {
      this.reqObj.page = 0;
    } else {
      //接口page从0下标位开始

      this.reqObj.page = this.reqObj.page - 1;
      if (this.reqObj.page < 0) {
        this.reqObj.page = 0;
      }
    }

    that.isTableLoading = true;
    this.httpReq.post("oldman/asslist", null, this.reqObj, data => {
      that.reqObj.page++;
      sessionStorage.setItem(that.router.url, JSON.stringify(that.reqObj));
      that.isTableLoading = false;
      if (data["status"] == 200) {
        that.list = data["data"]["content"]; // 数据列表
        that.page.total = data["data"]["totalElements"]; // 总条数
      }
    });
  }

  deleteData(id) {
    const reqObj: any = {};
    reqObj.id = id;

    let that = this;
    that.isTableLoading = true;
    this.httpReq.post("oldman/del", null, reqObj, data => {
      that.isTableLoading = false;
      if (data["status"] == 200) {
        that.message.success("删除成功！");
        that.updateList(); // 调用查询列表方法更新列表
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

  giveupIn(id, e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    let that = this;
    this.modalService.confirm({
      nzTitle: "请确认当前老人是否需要放弃本次入院？",
      nzOkText: "确认",
      nzOkType: "danger",
      nzOnOk: () => {
        that.isTableLoading = true;
        that.httpReq.post("oldman/doNullify", null, { id: id }, data => {
          that.isTableLoading = false;
          if (data["code"] == 0) {
            that.message.success("保存成功！");
            that.updateList(); // 调用查询列表方法更新列表
          } else {
            that.message.error(data["message"]);
          }
        });
      },
      nzCancelText: "取消",
      nzOnCancel: () => console.log("Cancel")
    });
  }
}
